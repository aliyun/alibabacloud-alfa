# 1.0.0

## Breaking Changes

### Kernel 
 * change createMicroApp first option `id` to `name`
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