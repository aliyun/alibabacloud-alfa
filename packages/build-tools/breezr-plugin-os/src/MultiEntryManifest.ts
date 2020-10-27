import { Compiler, compilation } from 'webpack';
import { isObject } from 'lodash';
import { RawSource } from 'webpack-sources';

const defaultOptions = {};

interface MultiEntryManifestOptions {
  entryName: string;
}

export class MultiEntryManifest {
  private options: MultiEntryManifestOptions;

  public constructor(options: MultiEntryManifestOptions) {
    this.options = {
      ...defaultOptions, 
      ...options
    };
  }

  public apply (compiler: Compiler) {
    if (compiler.hooks) {
      compiler.hooks.emit.tap('MultiEntryManifest', (compilation) => {
        this.compileMultiEntry(compiler, compilation);
      });
    } else {
      compiler.plugin('emit', (compilation) => {
        this.compileMultiEntry(compiler, compilation);
      });
    }
  } 

  private compileMultiEntry(compiler: Compiler, compilation: compilation.Compilation) {
    const webpackConfig = compiler.options;
    const manifestStr = compilation.assets[this.options.entryName];
    const manifest = JSON.parse(manifestStr.source());

    if (isObject(webpackConfig.entry) && webpackConfig.output?.path) {
      // process the json
      const entries = Object.keys(webpackConfig.entry);
      if (entries.length == 1) {
        return;
      }

      entries.forEach((entryId) => {
        if (!manifest.entrypoints[entryId]) {
          return;
        }

        // @ts-ignore
        Object.values(manifest.entrypoints[entryId]).forEach((entryPaths: string[]) => {
          entryPaths.forEach((entryPath) => {
            if (!compilation.assets[entryPath]) {
              return;
            }
            compilation.assets[entryPath] = new RawSource(
              compilation.assets[entryPath].source().replace(
                `window.__CONSOLE_OS_GLOBAL_HOOK__("${this.options.entryName.replace('.manifest.json', '')}`,
                `window.__CONSOLE_OS_GLOBAL_HOOK__("${entryId}`,
              )
            )
          })
        })

        compilation.assets[`${entryId}.manifest.json`] = new RawSource(JSON.stringify({
          ...manifest,
          name: entryId,
          entrypoints: {
            [entryId]: manifest.entrypoints[entryId]
          }
        }, null, 2));
      });
    }
  }
}
