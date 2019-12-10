import axios from 'axios'
import { Lifecycle, AppInstance } from './type';

export const getFromCdn = async (url: string) => {
  const resp = await axios.get(url);
  if (resp.status === 200) {
    return resp.data;
  }
  throw resp;
}

export const invokeLifeCycle = async (fns: Lifecycle | Lifecycle[], app: AppInstance) => {
  if (!fns) {
    return;
  }
  if (fns instanceof Array) {
    Promise.all(fns.map(fn => fn(app)))
  } else {
    fns(app);
  }
}

function smellsLikeAPromise(promise) {
  return promise && typeof promise.then === 'function' && typeof promise.catch === 'function';
}

export function validateAppInstance(appInstance: AppInstance) {
  if (!appInstance.bootstrap && !appInstance.mount && !appInstance.unmount) {
    throw new Error(`The app ${appInstance.id}'s export is invalid, you should export bootstrap, mount, unmount`)
  }
}

export function flattenFnArray(fns, description) {
  fns = Array.isArray(fns) ? fns : [fns];
  if (fns.length === 0) {
    fns = [() => Promise.resolve()];
  }

  return function(props) {
    return new Promise((resolve, reject) => {
      function waitForPromises(index) {
        const promise = fns[index](props);
        if (!smellsLikeAPromise(promise)) {
          reject(`${description} at index ${index} did not return a promise`);
        } else {
          promise
            .then(() => {
              if (index === fns.length - 1) {
                resolve();
              } else {
                waitForPromises(index + 1);
              }
            })
            .catch(reject);
        }
      }
      waitForPromises(0);
    });
  }
}

export const getRealUrl = (urlStr: string, base: string) => {
  // TODO: FUCK CODE
  let sourceUrl = urlStr;
  if (base.indexOf('dev.g.alicdn.com') !== -1) {
    sourceUrl = urlStr.replace('g.alicdn.com', 'dev.g.alicdn.com');
  }

  const url = new URL(sourceUrl, base);
  return url.toString()
};