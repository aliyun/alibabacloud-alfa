import { Compiler } from 'webpack';
import { RawSource } from 'webpack-sources';

export interface OSJsonpWebpackPluginOption {
  injectVars?: string[];
  jsonpCall?: string;
}

export class OSJsonpWebpackPlugin {
  public option: OSJsonpWebpackPluginOption;
  public constructor(option: OSJsonpWebpackPluginOption) {
    this.option = {
      ...option,
    };
  }

  public apply(compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'OSJsonpPlugin', // <-- Set a meaningful name here for stacktraces
      (compilation) => {
        compilation.hooks.afterOptimizeChunkAssets.tap('OSJsonpPlugin', (chunks) => {
          chunks.forEach(firstChunk => {
            if (!firstChunk) {
              return;
            }
            const entryFile = firstChunk.files.find((file) => file.endsWith('.js'));
            if (!entryFile) {
              return chunks;
            }
  
            const entryAsset = compilation.assets[entryFile];
            if (!entryAsset) {
              return;
            }
  
            const code: string = this._wrapCodeWithOSJsonp(this.getId(compiler), entryAsset.source());
  
            compilation.assets[entryFile] = new RawSource(code);
          });
        });
      }
    );
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
    throw new Error('library for os jsonp plugin should be string');
  }

  private _wrapCodeWithOSJsonp(id: string, code: string) {
    const injectVars = ['window', 'location', 'history', 'document', ...(this.option.injectVars || [])];
    const jsonpCall = this.option.jsonpCall || 'window.__CONSOLE_OS_GLOBAL_HOOK__';

    return `
if (!window.__CONSOLE_OS_GLOBAL_HOOK__){window.__CONSOLE_OS_GLOBAL_VARS_={};window.__CONSOLE_OS_GLOBAL_HOOK__ = function(id, resolver) {resolver(null, {}, {}, {${injectVars.join(',')}})};}
${jsonpCall}(${JSON.stringify(id)}, function(require, module, exports, {${injectVars.join(',')}}){ with(window.__CONSOLE_OS_GLOBAL_VARS_) { \n ${code} \n}})
`;
  }
}