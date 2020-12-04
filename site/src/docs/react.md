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

需要启动整个 Alfa 的运行时：

```javascript
// 然后应用的入口调用
import { start } from '@alicloud/console-os-react-app';
start();
```