# alibabacloud-console-os

## 介绍
```console-os``` 是在阿里云控制台体系中孵化🐣的微前端方案， 定位是面向企业级的微前端体系化解决方案。

## 特性

 * 📦 开箱即用，无代码侵入
 * 📎 完善的微前端体系支撑

## 使用文档

子应用

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

宿主应用

```javascript
import Application from '@alicloud/console-os-react-app'

const appConfigUrl = 'https://dev.g.alicdn.com/aliyun-next/endpoint/0.1.0/aliyun-console-slb.manifest.json';

const Home =  () => (
  <Application
    manifest={appConfigUrl}
    id="aliyun-console-slb"
  />
);
export default Home;
```

## 贡献指南

参见[贡献指南](https://github.com/aliyun/alibabacloud-console-toolkit/blob/master/CONTRIBUTING.md)
