---
name: optimization
zhName: 自定义运行时
tags: 
  advance: true
sort: 6
---

# 自定义运行时

## 背景
通常情况下为了减小应用体积，我们希望抽离出一套各个微应用共同依赖的库，来减小重复加载，以及便于管理 微应用的运行时，并且做统一的升级。 所以 ConsoleOS 提供出自定义业务自定义自己的业务 Runtime.

## 运行时定义

这里公共运行时，任然作为一个特殊的微前端应用，具体代码可以参考 这里 React16 的样例运行时，这个应用导出为你依赖的 React 和 React-Dom
注意 ConsoleOS 中实现了一个简单的 cmd 版本的加载器， 所以你导出对象中，必须以 react commonjs 的版本名字来导出。然后这里这个工程被打包成一个 ConsoleOS 应用，发布到cdn 上去。

```javascript
import React_ from 'react';
import ReactDOM_ from 'react-dom';
export default {
  // key 必须是 react, 不能是 React或者其他的
  'react': React_,
  'react-dom': ReactDOM_,
  '__version': '0.1.0',
}
```

注意每个微前端应用都有个唯一 id 表示，runtime 也不能例外:

```javascript
// consoleos 的打包配置
plugins: [
    ['@alicloud/console-toolkit-plugin-os', {
      id: 'OSRuntimeReact16'
    }]
  ]
```

### 指定微前端应用运行时

在微应用配置的时候这里以 console-toolkit-plugin-os 为例子, 你可以首先指定自己的 微前端应用 需要 external 掉那些库，比如下面代码展示的 react, react-dom, 在打包构建的时候被 external 出来，然后在 ConsoleOS 应用打包的时候指定了 runtime 是上面打包出来的. https://dev.g.alicdn.com/ConsoleOS/runtime-react-16/0.0.1/index.js 

```
const path = require('path');
module.exports = {
  presets: [
    [
      '@ali/breezr-preset-wind', {
        webpack(config) {
          config.externals = {
            react: {
              root: 'React',
              commonjs2: 'react',
              commonjs: 'react',
              amd: 'react',
            },
            'react-dom': {
              root: 'ReactDOM',
              commonjs2: 'react-dom',
              commonjs: 'react-dom',
              amd: 'react-dom',
            }
          }
          return config;
        }
      }
    ]
  ],
  plugins: [
    ['@alicloud/console-toolkit-plugin-os', {
      id: 'os-example',
      runtime: {
        id: 'OSRuntimeReact16',
        url: 'https://dev.g.alicdn.com/ConsoleOS/runtime-react-16/0.0.1/index.js'
      }
    }]
  ]
}
```

在打包之后你可以看到 manifest 中多出了一个 runtime 字段, 用来表示公共加载的运行时：

```json
{
  "name": "os-example",
  "resources": {
    "index.css": "//g.alicdn.com/ConsoleOS/OSExample/0.0.4/index.css",
    "index.js": "//g.alicdn.com/ConsoleOS/OSExample/0.0.4/index.js"
  },
  "runtime": {
    "id": "OSRuntimeReact16",
    "url": "https://dev.g.alicdn.com/ConsoleOS/runtime-react-16/0.0.1/index.js"
  },
  "entrypoints": {
    "index": {
      "css": [
        "//g.alicdn.com/ConsoleOS/OSExample/0.0.4/index.css"
      ],
      "js": [
        "//g.alicdn.com/ConsoleOS/OSExample/0.0.4/index.js"
      ]
    }
  }
}
```

多个不同的项目可以配置同一个运行时，这个运行时只会被全局加载一遍。

## 例子

下面的例子演示如何构造两个运行时，如何微应用中如何使用运行时，以及主应用加载配置了两个运行时的应用：

运行时：
react 15 运行时 demo: http://gitlab.alibaba-inc.com/ConsoleOS/ConsoleRuntime/tree/daily/0.1.0
react 16 运行时 demo: http://gitlab.alibaba-inc.com/ConsoleOS/runtime-react-16

微应用

使用React 16 运行时的微应用 包含了 react-hooks：http://gitlab.alibaba-inc.com/ConsoleOS/OSExample/tree/runtime/0.0.4
使用React 15 运行时 使用了 fusion 0.x：http://gitlab.alibaba-inc.com/ConsoleOS/os-example-react15

加载上面两个微应用的主应用：
https://codesandbox.io/s/frosty-violet-psm4s?file=/src/index.js