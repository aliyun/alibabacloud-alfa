---
name: communication
zhName: 通信
sort: 4
---

# 通信

你可以选择，Props 通信 或者 事件做通信

## Props

在宿主应用中你可以配置自定的 props, 传递给子应用

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

子应用中可以接受宿主传入的 props

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

## 事件

宿主中使用事件总线
```javascript
// 宿主应用
import { createEventBus } from '@alicloud/console-os-react-app'
const eventBus = createEventBus();

// 接受子应用的事件
eventBus.on('app1-event', {/* data */})
```

子应用中使用事件总线
```javascript
export default mount(
  (props) => {
    // 子应用发出事件
    props.emitter.trigger('app1-event', 1)
    return <App/>
  },
  document.getElementById('app'),
  appID
);
```