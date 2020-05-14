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

Then you need to register you sub application using registerApplication method

```javascript
import { registerApplication } from '@alicloud/console-os-kernal';

const vpc = await registerApplication({
  manifest: 'https://g.alicdn.com/aliyun-next/vpc/manifest.json',
  appWillMount() {
    // your mount logic
  },
  appWillUnmount() {
    // your unmount logic
  },
  activityFn: isActiveApp(appId),
  dom: documnent.getElementById('app')
});
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