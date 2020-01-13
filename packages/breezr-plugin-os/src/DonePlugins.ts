import { Compiler } from 'webpack';

const defaultOptions = {};

interface DoneOptions {
  done: () => void;
}

export class DonePlugin {
  private options: DoneOptions;

  public constructor(options: DoneOptions) {
    this.options = {
      ...defaultOptions, 
      ...options
    };
  }

  public apply (compiler: Compiler) {
    compiler.hooks.done.tap(
      'DonePlugin', // <-- Set a meaningful name here for stacktraces
      (data) => {
        this.options.done && this.options.done()
        return data;
      }
    );
  }
}
