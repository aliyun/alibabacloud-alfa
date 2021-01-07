# Alfa (React Version)

标准微前端 API 的 React 版本，面向最终用户。

# Usage

创建 Alfa 微应用

```javascript
import { createAlfaWidget, createAlfaApp } from '@alicloud/alfa-react';

const AlfaMicroApp = createMicroApp({
  name: '@ali/example',
  version: '1.0'
});


const App = () => {
  return <AlfaMicroApp />
}
```

创建历史 Widget

```javascript
import { createAlfaWidget } from '@alicloud/alfa-react';

const AlfaWidget = createWidget({
  name: '@ali/example',
  version: '1.x'
});


const App = () => {
  return <AlfaWidget />
}
```

```javascript
import { createAlfaWidget } from '@alicloud/alfa-react';

const AlfaWidget = createAlfaWidget({
  name: '@ali/example',
  url: 'https://some-url/index.js',
  runtimeVersion: '1.9.3',
  env: 'pre'
});


const App = () => {
  return <AlfaWidget />
}
```

# API

```createAlfaApp(AlfaFactoryOption)```

## AlfaFactoryOption

| 属性名         | 类型                                       | 说明                    | 默认值    |
| ------------- | ------------------------------------------ | ---------------------- | --------- |
| name            | `id: string;`                              | widget or alfa app ID  | -  |
| version       | `version: string;`                         | 微应用版本               | -  |
| env           | `env?: 'prod' | 'local' | 'pre' | 'daily'` | 当前环境                 | -  |
| loading       | `loading?: boolean | React.ReactChild;`    | 微应用加载的 loading 展示 | -  |
| url           | ```url?: string;```                        | JS entry 的 URL         | - |
| manifest      | ```url?: string;```                   | ConsoleOS 的 manifest         | - |

## WidgetFactoryOption

```createAlfaWidget(WidgetFactoryOption)```

| 属性名         | 类型                                       | 说明                    | 默认值    |
| ------------- | ------------------------------------------ | ---------------------- | --------- |
| name            | `id: string;`                              | widget or alfa app ID  | -  |
| version       | `version: string;`                         | 微应用版本               | -  |
| env           | `env?: 'prod' | 'local' | 'pre' | 'daily'` | 当前环境                 | -  |
| loading       | `loading?: boolean | React.ReactChild;`    | 微应用加载的 loading 展示 | -  |
| url           | ```url?: string;```                        | JS entry 的 URL         | - |
| runtimeVersion| ```runtimeVersion?: string;```             | Widgtet runtime 版本     | - |

## widgetEventEmitter

```javascript
import { widgetEventEmitter } from '@alicloud/alfa-react'; 

widgetEventEmitter.on('event', handleEvent)

widgetEventEmitter.emit('event', [a, b])
```

