---
name: sandbox
zhName: 沙箱
tags: 
  advance: true
sort: 9
---

# 沙箱

## 沙箱 URL

目前沙箱会创建 iframe 来保存 location, history, setTimeout。如果希望开启沙箱，提供一个和站点同域的 url。（为了保持 性能 请保证这个URL 的返回不包含任何内容）。

```jsx
start({
    sandbox: {
    // 全局变量白名单，可选
    externalsVars: [],
    // url path, 可选默认 /api.json
    sandBoxUrl: '/xxxx/os'
  }
});
```

## 沙箱配置

目前应用默认开启沙箱，所有的 window 的变量和 location & history 目前都是隔离的。

但是有些时候有些变量希望主应用和子应用共享，那么在配置上我们提供了白名单来让子应用能够访问到子应用中的变量。你可以通过指定 externalsVars 来配置主应用中可访问的变量的白名单。

例如，你在 window 上有个变量 window.USER 你可以通过如下方式来配置让子应用也能访问到这个 USER  变量。

```jsx
// Home.jsx
const appConfigUrl = 'https://dev.g.alicdn.com/aliyun-next/endpoint/0.1.0/endpoint.manifest.json';
const Home = () => (
  <Application
    manifest={appConfigUrl}
    id="aliyun-console-slb"
    externalsVars={[
      'USER'      
    ]}
  />
);
export default Home;
```
