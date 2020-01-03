const defaultOptions = {};

module.exports = class DonePlugin {
  constructor(options) {
    this.options = {
      ...defaultOptions, 
      ...options
    };
  }

  apply (compiler) {
    compiler.hooks.done.tap(
      'DonePlugin', // <-- Set a meaningful name here for stacktraces
      (data) => {
        this.options.done && this.options.done()
        return data;
      }
    );
  }
}
