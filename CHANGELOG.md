# 1.2.2
## Fix
### Kernel 

 * 修复导出类型未被 babel 编译掉的问题


# 1.2.0
## Feature
针对宿主提供了 React 针对默认路由处理的同步逻辑

import Application,  { withDefaultRouterHandler } from  '@alicloud/console-os-react-app';


const App = withDefaultRouterHandler(Application);

<App 
  history={history} // react router 的 history
/>
并且在子应用中提供了 data-alfa-external-router 的属性来作为不属于子应用中链接，通知宿主做跳转

<a data-alfa-external-router  href="/xxx"/> 


# 1.0.21
## Feature
### Alfa React
 * feat: resolve aliyun dynamic config for cdn

# 1.0.20
## Feature
### postcss-prefix-wrapper
 * fix [#63](https://github.com/aliyun/alibabacloud-alfa/issues/63): postcss-prefix-wrapper isolation incorrectly for normal font-family

# 1.0.19
## Feature
### postcss-prefix-wrapper
 * feat: icon font isolation

# 1.0.5
## Feature
### Build tools
 * feat: Write the webpack externals to manifest.json

# 1.0.2
## Feature
### Browser VM
 * Feat: solve the problem of sandbox dynamic script escape 

# 1.0.0
## Feature
  * Add the Vue Application for Vue Application as Host App;

## Breaking Changes

### React App, NG App
 * change Application props `id` to `name`
 * change Application props `sandBox` to `sandbox`
 * remove Application props `externalsVars`, using `sandbox.externalsVars` instead
 * remove Application props `initialPath`,  using `sandbox.initialPath` instead

### Kernel 
 * change createMicroApp first option `id` to `name`
 * change createMicroApp first option `sandBox` to `sandbox`
 * change api `distroy` to `destroy`,


# 0.3.10
* Feat: sync initial path for sandbox every app mount

# 0.3.9
* Feat: custorm loading for react app
* Fix: sandbox box not working for prefetch

# 0.3.8
* Feat: build multi sub app according to webpack multi entry config
* Fix: css wrap not working for multiple dir

# 0.3.7
* Fix: sandbox context initialize fails sometimes, because the iframe url was assigned after the iframe append to body;
* Feat: now props.appDidCatch can trigger when sub app has error in react application;

# 0.3.6
* Fix: Context update body error when sandbox is disable
* Fix: Type error for first args of mount function in react portal

# 0.3.5
* Fix: Add the Type Define for React Portal


# 0.3.4
* Optimization: now using react.fragment in for react16 and div in react15 for react-application.

# 0.3.3
* Feature: make css wrap as a independent package

# 0.3.2
* Feature: add the new prefetch api for preload sub app
* Feature: add the new kernal api
``` javascript
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
* Fix: withSyncRouter not working in react15

# 0.2.16
* Fix: Remove es6 syntax in umd release for console-os-kernal

# 0.2.15
* Feat:remove router change event for syncHistory hoc in react portal

# 0.2.14
* Fix: UMD Build For ConsoleOS Kernal

# 0.2.13
* Fix: get history incorrectly in ConsoleOS browser vm

# 0.2.12
* Fix: ng build --extract-css no working for extract standalone css

# 0.2.11
* Feature: Now ConsoleOS can load pre scripts before real entry load.
* Fix: window.addEventListener("resize|scroll|focus|blur") no working

# 0.2.10
* Feature: Add the NG support: ng-build, ng-portal, ng-application
* Fix: Vue Portal get undefined eventEmitter.
* Example: Add NG example see, exmaple/SubApp/Anuglar

# 0.1.5
Types: add the types for react-portal, react-application, loader, events.

# 0.1.4
Types: add the types for react-portal, react-application, loader, events.

# 0.1.3
Feature: Add the ng module, no ```<console-os manifest="xxx"></console-os>``` loading consoleos app.

# 0.1.2
Feature: Angular now can load consoleos app by @alicloud/console-os-ng-app.

# 0.1.1
Fix: fix typo error in react-application: unmout -> unmount.

# 0.1.0
First Release. Introduction see [AlibabaCloud Console OS](https://aliyun.github.io/console-os).