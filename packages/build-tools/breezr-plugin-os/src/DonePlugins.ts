import { Compiler, Configuration } from 'webpack';

const defaultOptions = {};

interface DoneOptions {
  done: (option: Configuration) => void;
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
    } else {
      // @ts-ignore
      compiler.plugin('done', (data: any) => {
        this.options.done && this.options.done(compiler.options);
        return data;
      });
    }
  }
}
