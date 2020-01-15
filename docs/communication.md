---
name: communication
zhName: 通信
sort: 4
---

你可以选择，Props 通信 或者 事件做通信

## Props

在宿主应用中你可以配置

```javascript
// 宿主应用
import Application from '@alicloud/console-os-react-app'

const appConfigUrl = 'https://dev.g.alicdn.com/aliyun-next/endpoint/0.1.0/endpoint.manifest.json';

const Home =  () => (
  <Application
    manifest={appConfigUrl}
    id="aliyun-console-slb"
    test={1} // 传递 props
  />
);
export default Home;
```

```javascript
// 子应用
import { mount }  from '@ali/os-react-portal';
import App from './app';

const appID = 'aliyun-console-slb'

export default mount(
  (props) => {
    // 消费子
    console.log(props.test)
    return <App/>
  },
  document.getElementById('app'),
  appID
);
```