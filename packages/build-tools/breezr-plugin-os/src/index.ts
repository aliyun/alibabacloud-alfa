import * as WebpackChain from 'webpack-chain';
import * as webpack from 'webpack';
import * as minimist from 'minimist'
import { wrapCss } from 'postcss-prefix-wrapper';
import * as path from 'path'
import * as WebpackAssetsManifestPlugin from 'webpack-assets-manifest';
import { PluginAPI, PluginOptions } from '@alicloud/console-toolkit-core';
import { DonePlugin } from './DonePlugins';
import { normalizeId } from './utils/normalizeId';
import { OSJsonpWebpackPlugin } from './OSJsonpPlugin';
import { MultiEntryManifest } from './MultiEntryManifest';
import { registerConfigToRegistry } from './utils/registerConfigToRegistry';
import { getEnv, error, info, exit, debug, done } from "@alicloud/console-toolkit-shared-utils";

let globalSSREntry: string | null = null;

export const chainOsWebpack = (options: PluginOptions) => async (config: WebpackChain) => {
  if (process.env.IS_SSR === 'true') {
    return;
  }
  const { jsonpCall, injectVars, ssrEntry } = options;
  options.id = normalizeId(options.name || options.id);
  config
    .output
    .library(options.id)
    .libraryTarget('umd');

  config
    .plugin('OSJsonpPlugin')
    .use(OSJsonpWebpackPlugin, [{
      injectVars,
      jsonpCall,
      id: options.id
    }]);

  if (!options.webpack5) {
    config
      .output
      .jsonpFunction(`webpackJsonp${options.id}`)
  }

  if (!options.webpack3) {
    config
    .output
    // @ts-ignore
    .devtoolNamespace(options.id);
  
    config.plugin('WebpackAssetsManifestPlugin').use(WebpackAssetsManifestPlugin, [{
      transform: (manifest: any, plugin: any) => {
        const entrypoints = manifest.entrypoints;
        if (entrypoints) {
          delete manifest.entrypoints;

          Object.values(entrypoints).forEach((entry: any) => {
            if (entry && entry.css && !options.disableOsCssExtends && !options.disableCssPrefix) {
              entry.css = entry.css.map((cssBundle: any) => cssBundle.replace('.css', '.os.css'))
            }
          })
        }
        return {
          name: options.id,
          resources: manifest,
          externals: plugin.compiler.options.externals || {},
          runtime: options.runtime || {},
          entrypoints: entrypoints,
          server_entrypoint: ssrEntry ? ssrEntry : globalSSREntry
        };
      },
      publicPath: true,
      entrypoints: true,
      output: `${options.id}.manifest.json`
    }]);
  
    config.plugin('MultiEntryManifest').use(MultiEntryManifest, [{
      entryName: `${options.id}.manifest.json`,
    }]);
  }
  
  config.plugin('WebpackDonePlugin').use(DonePlugin, [{
    done: () => {
      // process css
      if (options.disableCssPrefix) {
        return;
      }

      wrapCss(options.cssBuildDir || config.output.get('path'), options.cssPrefix || options.id, {
        ext: '.os.css',
        disableOsCssExtends: options.disableOsCssExtends,
      })
    }
  }])

  config.externals({
    '@alicloud/console-os-environment': {
      commonjs2: '@alicloud/console-os-environment',
      amd: '@alicloud/console-os-environment',
      commonjs: '@alicloud/console-os-environment',
      root: 'aliOSEnvironment',
    }
  });

  config.plugin('DefinedConsoleOSPlugin').use(webpack.DefinePlugin, [{
    'process.env.CONSOLE_OS_PUBLIC_PATH': JSON.stringify(config.output.get('publicPath') || ''),
  }])

  registerConfigToRegistry(options.id, {
    port: config.devServer.get('port'),
    https: config.devServer.get('https'),
  });
}

const buildOsBundle = async (api: PluginAPI, opts: PluginOptions) => {
  try {
    info('building console os bundle');

    process.env.IS_CONSOLE_OS_BUNDLE = 'true';

    const config = new WebpackChain();
    await api.emit('onChainWebpack', config, getEnv());

    // server config
    config.output.path(path.join(config.output.get('path'), 'microApp'));

    // config output
    chainOsWebpack({
      disableOsCssExtends: true,
      ...opts,
    })(config);

    debug('ssr', config.toConfig());

    await api.dispatch('webpack', {
      config: config.toConfig(),
      /* 强制复写用户的 自定义 webpack */
      webpack: (conf: any, ...args: any[]) => {
        if (opts.webpack) {
          return opts.webpack(config.toConfig(), ...args)
        }
        return config.toConfig()
      }
    });


    process.env.IS_CONSOLE_OS_BUNDLE = undefined;

    done('console os bundle build successfully!');
  } catch(e) {
    error(e.toString());
    debug('ssr', e.stack);
    exit(0);
  }
};

export default (api: PluginAPI, options: PluginOptions) => {
  const args = minimist(process.argv.slice(2));

  api.registerSyncAPI('configMicroAppSSREntry', (ssrEntryPath) => {
    globalSSREntry = ssrEntryPath;
  });

  // ssr for prod build
  if (getEnv().isProd() && (options.enableStandaloneBundle || args.enableStandaloneBundle)) {
    api.dispatchSync('registerBeforeBuildStart',  async () => { await buildOsBundle(api, options); });
  } else {
    api.on('onChainWebpack', chainOsWebpack(options));
  }

  api.dispatchSync('addHtmlHeadScript', `
<style>
html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{-webkit-box-sizing:content-box;box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:inherit;font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{-webkit-box-sizing:border-box;box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}[hidden],template{display:none}
</style>
`)
};
