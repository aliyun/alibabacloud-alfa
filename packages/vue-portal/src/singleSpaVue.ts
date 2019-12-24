/**
MIT License

Copyright (c) 2016 Bret Little

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import Vue from 'vue';

const defaultOpts = {
  // required opts
  Vue: null,
  appOptions: null,
  template: null,
}

function bootstrap(opts) {
  if (opts.loadRootComponent) {
    return opts.loadRootComponent().then(root => opts.rootComponent = root)
  } else {
    return Promise.resolve();
  }
}

function mount(opts, mountedInstances, props) {
  return Promise
    .resolve()
    .then(() => {
      const appOptions = {...opts.appOptions}
      if (props.domElement && !appOptions.el) {
        const div = document.createElement('div');
        props.domElement.appendChild(div);
        appOptions.el = div
      }

      if (!appOptions.el) {
        const htmlId = `single-spa-application:${props.name}`
        appOptions.el = `#${htmlId.replace(':', '\\:')} .single-spa-container`
        let domEl = document.getElementById(htmlId)
        if (!domEl) {
          domEl = document.createElement('div')
          domEl.id = htmlId
          document.body.appendChild(domEl)
        }

        // single-spa-vue@>=2 always REPLACES the `el` instead of appending to it.
        // We want domEl to stick around and not be replaced. So we tell Vue to mount
        // into a container div inside of the main domEl
        if (!domEl.querySelector('.single-spa-container')) {
          const singleSpaContainer = document.createElement('div')
          singleSpaContainer.className = 'single-spa-container'
          domEl.appendChild(singleSpaContainer)
        }

        mountedInstances.domEl = domEl
      }

      if (!appOptions.render && !appOptions.template && opts.rootComponent) {
        appOptions.render = (h) => h(opts.rootComponent)
      }

      if (!appOptions.data) {
        appOptions.data = {}
      }

      appOptions.data = {...appOptions.data, ...props}

      mountedInstances.instance = new Vue(appOptions);
      if (mountedInstances.instance.bind) {
        mountedInstances.instance = mountedInstances.instance.bind(mountedInstances.instance);
      }
    })
}

function update(opts, mountedInstances, props) {
  return Promise.resolve().then(() => {
    const data = {
      ...(opts.appOptions.data || {}),
      ...props,
    };
    for (let prop in data) {
      mountedInstances.instance[prop] = data[prop];
    }
  })
}

function unmount(opts, mountedInstances) {
  return Promise
    .resolve()
    .then(() => {
      mountedInstances.instance.$destroy();
      mountedInstances.instance.$el.innerHTML = '';
      delete mountedInstances.instance;

      if (mountedInstances.domEl) {
        mountedInstances.domEl.innerHTML = ''
        delete mountedInstances.domEl
      }
    })
}

export default function singleSpaVue(userOpts) {
  if (typeof userOpts !== 'object') {
    throw new Error(`single-spa-vue requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts,
  };

  if (!opts.appOptions) {
    throw new Error('single-spa-vuejs must be passed opts.appOptions');
  }

  // Just a shared object to store the mounted object state
  let mountedInstances = {};

  return {
    bootstrap: bootstrap.bind(null, opts, mountedInstances),
    mount: mount.bind(null, opts, mountedInstances),
    unmount: unmount.bind(null, opts, mountedInstances),
    update: update.bind(null, opts, mountedInstances),
  };
}