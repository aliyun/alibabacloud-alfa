---
name: react
tags: 
  ecosystem: true
zhName: 生态 - React
sort: 99
---

# React

## 子应用

```bash
> npm i @alicloud/console-os-react-portal@latest --save
> npm i @alicloud/console-toolkit-plugin-os@latest --save-dev
```

对于 React 应用，只需要修改一下入口文件如下：

```javascript
import { mount }  from '@alicloud/console-os-react-portal';
import App from './app';
const appID = 'aliyun-console-slb'
export default mount(
  (props) => <App/>,
  document.getElementById('app'),
  appID
);
```

构建 webpack 接入修改

```javascript
const Chain = require('webpack-chain');
const merge = require('webpack-merge');
const { chainOsWebpack } = require('@alicloud/console-toolkit-plugin-os')

const chain = new Chain();
chainOsWebpack({ id: 'app-id' })(chain);
module.exports = merge(/*you webpack conf*/, chain.toConfig());
```

### 判断 Console OS 的环境

有时候我们需要判断是不是在 Alfa 运行环境从而选择一些功能的展示或者隐藏。

```javascript
import { Context }  from '@alicloud/console-os-react-portal';
<Context>
  {(context) => {
    if (context.inOsSandBox) {
      // Do your things
    }
  }}
</Context>
// 或者用
window.__IS_CONSOLE_OS_CONTEXT__
```

## 宿主应用

对于子应用来说，最终构建会生成一个类似于的一个 manifest 文件。 ```https://dev.g.alicdn.com/aliyun-next/endpoint/0.1.0/endpoint.manifest.json```

```javascript
import {Route} from 'react-router'
import Home from 'xxxx/Home'
const router = () => {
  <Route path={'xxxx'} component={Home} />
   {/* 原本的 */}
  <Route path={'xxxx'} />
}
 
// Home.jsx
import Application from '@alicloud/console-os-react-app'
const appConfigUrl = 'https://dev.g.alicdn.com/aliyun-next/endpoint/0.1.0/endpoint.manifest.json';
const Home =  () => (
    <Application
    manifest={appConfigUrl}
        id="aliyun-console-slb"
    />
);
export default Home;
```


## API

### 子应用 @alicloud/console-os-react-portal
#### mount

```typescript
mount<T extends EmitterProps>(App: AppComponent<T>, container?: Element | null)
```
用来替换 ```ReactDom.mount```。 如果不是在宿主容器中，会以 ```ReactDom.mount``` 的方式加载到你指定的 ```container``` 节点中，如果是在宿主容器中，则会返回一下几个生命周期方法, 提供给宿主消费：

```typescript
{
  bootstrap: [
    reactLifecycles.bootstrap,
  ],
  mount: [
    reactLifecycles.mount,
  ],
  unmount: [
    reactLifecycles.unmount,
  ],
  update: [
    reactLifecycles.update,
  ],
  exposedModule: exposeModuleMap
}
```

注意你需要以 UMD 的方式导出 ```mount``` 方法的返回。

#### registerExposedModule

```typescript
registerExposedModule(moduleName: string, modules: any) => void
```

注册可以被其他应用消费的模块，详细请参考[共享子应用模块](/docs/exposed-module.html)

#### withSyncHistory

```typescript
withSyncHistory = (Comp: React.ComponentClass | React.FC, history: History) => React.ComponentClass | React.FC
```
路由同步的高级组件，当应用被该高阶组件包裹时，会接收宿主传递的 path 属性，来自动的通过 history 来执行 history.push(props.path);

注意： history 必须是传递给 react-router 的 history 对象。在 react-router 3 中，通过 ```createBrowserHistory``` 必须是传递给 Router 组件的同一个 history. react-router 4 中，必须是 ```<BrowserRouter>``` or ```<HashRouter>``` 中 prop 传递出来的 history

详细请参考[指定路由定位到子应用的页面](/docs/exposed-module.html)

#### withCompatibleSyncHistory

```typescript
withCompatibleSyncHistory = (Comp: React.ComponentClass | React.FC, history: History) => React.ComponentClass | React.FC
```
兼容 React 15 的 的路由同步 API.

#### isOsContext

```typescript
isOsContext = () => boolean
```
用来判断子应用是是否处在 alfa 的容器中

#### EventEmitter

emitter 的类型导出

### 宿主应用 @alicloud/console-os-react-app

#### Application

#### start

#### createEventBus

#### prefetch

#### loadExposedModule

