---
name: quick-start
zhName: 快速开始
sort: 2
tags: 
  overview: true
---
# 快速开始

## 写在前面

在微前端的中，分为两个部分：

* 子应用，或者叫做微应用
* 基座应用，或者叫做容器应用

子应用：是按照功能维度拆分的应用，往往是个功能或者一组功能的集合。

基座应用：他是所有子应用的一个容器，用来加载，渲染不同的子应用。

## 项目微前端改造往往涉及到：

1.把功能子应用化，即功能拆分，独立成一个前端 App

2.在老应用中（或者完全新建基座应用）引入微前端的容器 SDK，在这个基座应用中组织，加载每个子应用。

下面以 React 为例，介绍如何快速开始试用 Alfa 做应用拆分。

## 子应用

### React 应用

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

### React
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