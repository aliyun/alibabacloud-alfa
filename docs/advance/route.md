---
name: route
zhName: 路由
tags: 
  advance: true
sort: 6
---

# 路由

## 保持宿主路由同步

``` javascript
import { createEventBus } from '@alicloud/console-os-react-app'
const eventBus = createEventBus()
const appId = '你的子应用 ID';
eventBus.on(`${appId}:history-change`, (location) => {
  // 你的处理逻辑
  window.history.pushState(null, null, location.href)
});
```

## 指定路由定位到子应用的页面

有时候在宿主中，需要做一些路由定位的事情，比如我在宿主里面想定位到一个子应用的具体页面, 你需要在宿主中指定一个Path，如下代码：

``` jsx
import ConsoleApp from '@alicloud/console-os-react-app'
const MANIFEST_URL = 'http://cdn.com/sub-app.manifest.json'
export default () => (
  <ConsoleApp
    path="/sub-app" // it will redirect the sub app to path /sub-app
    manifest={MANIFEST_URL}
  />
)
```

你只需要对子应用做如下改造， 在子应用的入口添加入 withSyncHistory 的一个靠接组件就能够完成路由同步：

```jsx
import { mount, withSyncHistory } from '@alicloud/console-os-react-portal';
import { createBrowserHistory } from 'history';
import App from './app';

// 重点改造这里
const history = createBrowserHistory();
export default mount(
  // add this wrapper
  // 重点改造这里
  withSyncHistory(App, history),
  // dom, you mount no in console os environment
  document.getElementById('app'),
  // sub app id
  'sub-app'
);
```
