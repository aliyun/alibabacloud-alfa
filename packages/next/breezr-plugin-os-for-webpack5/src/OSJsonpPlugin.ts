import { Compiler, Compilation } from 'webpack';
import { ConcatSource } from 'webpack-sources';

export interface OSJsonpWebpackPluginOption {
  injectVars?: string[];
  jsonpCall?: string;
  id: string;
  webpack5?: boolean;
}

export class OSJsonpWebpackPlugin {
  option: OSJsonpWebpackPluginOption;
  constructor(option: OSJsonpWebpackPluginOption) {
    this.option = {
      ...option,
    };
  }

  apply(compiler: Compiler) {
    if (compiler.hooks) {
      compiler.hooks.compilation.tap(
        'OSJsonpPlugin', // <-- Set a meaningful name here for stacktraces
        (compilation) => {
          compilation.hooks.processAssets.tap({
            name: 'OSJsonpPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          }, (chunks) => {
            this.wrappChunks(compiler, compilation, chunks);
          });
        },
      );
    }
  }

  private wrappChunks(compiler: Compiler, compilation: Compilation, assets: Compilation['assets']) {
    Object.entries(assets).forEach(([id, asset]) => {
      if (!id.endsWith('.js')) return;

      const code = asset.source().toString();

      const [prefix, suffix] = this._wrapCodeWithOSJsonp(this.option.id || this.getId(compiler));

      // @ts-ignore
      compilation.assets[id] = new ConcatSource(prefix, code, suffix);
    });
  }

  private getId(compiler: Compiler): string {
    const { output } = compiler.options;
    if (!output) {
      return '';
    }
    const { library } = output;
    if (typeof library === 'string') {
      return library;
    }
    if (typeof library === 'object') {
      // @ts-ignore
      return library.name;
    }
    throw new Error('library for os jsonp plugin should be string');
  }

  private _wrapCodeWithOSJsonp(id: string) {
    const injectVars = ['window', 'location', 'history', 'document', ...(this.option.injectVars || [])];
    const jsonpCall = this.option.jsonpCall || 'window.__CONSOLE_OS_GLOBAL_HOOK__';

    return [`
if (!window.__CONSOLE_OS_GLOBAL_HOOK__){window.__CONSOLE_OS_GLOBAL_VARS_={};window.__CONSOLE_OS_GLOBAL_HOOK__ = function(id, resolver) {resolver(undefined, undefined, undefined, {${injectVars.map((item) => `${item}: ${item}`).join(',')}})};window.__CONSOLE_OS_GLOBAL_HOOK__.standalone = true}
${jsonpCall}(${JSON.stringify(id)}, function(require, module, exports, context){ ${injectVars.map((item) => `var ${item} = context.${item}`).join(';')};with(window.__CONSOLE_OS_GLOBAL_VARS_) { \n
`, '\n}})'];
  }
}
