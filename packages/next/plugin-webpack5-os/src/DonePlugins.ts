import { Compiler, WebpackOptionsNormalized } from 'webpack';

const defaultOptions = {};

interface DoneOptions {
  done: (option: WebpackOptionsNormalized) => void;
}

export class DonePlugin {
  private options: DoneOptions;

  constructor(options: DoneOptions) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  apply(compiler: Compiler) {
    if (compiler.hooks) {
      compiler.hooks.done.tap(
        'DonePlugin', // <-- Set a meaningful name here for stacktraces
        (data) => {
          this.options.done && this.options.done(compiler.options);
          return data;
        },
      );
    }
  }
}
