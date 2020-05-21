# Console OS Kernal

Kernal for Console OS

## TODO

- [x] load app by single bundle
- [x] load app by manifest
- [x] security sandbox
- [ ] cache by service work

## How to use

First 
```bash
npm i @alicloud/console-os-kernal --save
# or
yarn add @alicloud/console-os-kernal --save
# or
tnpm i @alicloud/console-os-kernal --save
```

Then you create you sub application using createMicroApp

```javascript
import { createMicroApp, load, mount, unmount } from '@alicloud/console-os-kernal';

const microApp = await createMicroApp({
  id: 'micro-app-id-1',
  manifest: 'https://xxx.micro-app-id-1.manifest.json';
});

await load(microApp);

await mount(microApp, {
  dom: document.querySelector('#app'),
  props
});

await update(microApp, {/* you props */});

await unmount(microApp);
```

Last, in the entry code of you main app, call start to start os

```javascript
// in the start of main app

import { start } from '@alicloud/console-os-kernal';

start();
```

## React

If you are using react as your UI framework, you can use sub app as a jsx element by using ```@alicloud/console-os-react-app```

```javascript
import ConsoleApp from '@alicloud/console-os-react-app'

const MANIFEST_URL = 'http://g.alicdn.com/aliyun-next/slb.manifest.json'

export default () => (
  <ConsoleApp
    manifest={MANIFEST_URL}
  />
)
```


## Build bundle

In OS, an app bundle is built by breezr, you can use @alicloud/console-toolkit-plugin-os to build your bundle

```javascript
/* breezr.config.js */

module.exports = {
  /*
   * other breezr config
   */
  plugins: [
    '@alicloud/console-toolkit-plugin-os'
  ]
}

```