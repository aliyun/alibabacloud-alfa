---
name: concept
zhName: 概念介绍
sort: 3
---

# 概念介绍

在微前端的中，分为两个部分：

 * 子应用，或者叫做微应用
 * 基座应用，或者叫做容器应用


| 术语 | 别名 |   含义  |
| :--------: | :----------: | :-------- |
|    主应用     |     宿主应用、容器应用      | 微前端定义中所谓的「一整个用户面」。<br/>它是用户界面的入口，承载一到多个微应用。<br/>主应用本身一般不直接负责业务逻辑，而是起到一个胶水的作用。 |
|    微应用     |     子应用      | 微前端定义中所谓的「独立交付的前端应用」。<br/>本身是普通的前端应用，负责具体的业务逻辑。<br/>可以独立交付（开发、部署、运行），但是一般会集成到主应用中运行。<br/>如有必要，甚至能集成到不同的主应用中。 |

在 Console OS 中，我们对应到上面的有两个概念 Portal & Application。

## Portal
portal 的概念是在子应用中的，由于个应用需要在入口的时候适配一些加载逻辑，所以我们对于每种不同框架的应用的入口加载逻辑做了封装，

以 React 的 Portal 作为例子：

```diff
import React from 'react';
-import ReactDom from 'ReactDom';
+import { mount }  from '@alicloud/console-os-react-portal';
import App from './app';

-ReactDom.render(<App />, document.getElementById('app'));

+const appID = 'aliyun-console-xxxx';
+export default mount(
+  (props) => <App {...props} />,
+  document.getElementById('app'),
+  appID
+);
```

先比与之前用 ```ReatDom.render``` 直接渲染到 ```app``` 这个节点上去, 在 ConsoleOS 子应用中 ```react-portal``` 的 ```mount``` 方法替换掉了 ```ReactDom.render```. 这个 ```mount``` 方法会处理判断是不是在 ConsoleOS 运行时中，如果不是则加载到了对应的 App 节点. 如果是就会导出提供给 ConsoleOS 加载的几个方法。

类似在 Vue 和 Ng，中也是类似的逻辑。

## Application

Application 是相对于宿主应用的，他会扮演一个容器的角色, 封装了把上面提到的子应用加载

```javascript
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

## 其他
### React

```javascript
// 子应用 portal
import { mount }  from '@alicloud/console-os-react-portal';
// 宿主容器
import Application from '@alicloud/console-os-react-app'
```

### Ng

```javascript
// 子应用 portal
import { bootstrap }  from '@alicloud/console-os-ng-portal';
// 宿主容器
import { ApplicationModule } from "@alicloud/console-os-ng-app";
```

### Vue

```javascript
// 子应用 portal
import { mount } from '@alicloud/console-os-vue-portal';
// 宿主容器
import Application from '@alicloud/console-os-vue-app';
```