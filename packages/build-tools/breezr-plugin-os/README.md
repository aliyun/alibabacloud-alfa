
# ConsoleOS 构建配置

## Aliyun Breezr

```javascript
plugins: [
  [
    '@alicloud/console-toolkit-plugin-os', {
      id: 'aliyun-console-xxxxx'
    }
  ]
]
```




## Webpack
构建 webpack 接入修改

```javascript
const Chain = require('webpack-chain');
const merge = require('webpack-merge');
const { chainOsWebpack } = require('@alicloud/console-toolkit-plugin-os')

const chain = new Chain();
chainOsWebpack({ id: 'app-id' })(chain);
module.exports = merge(/*you webpack conf*/, chain.toConfig());
```

## 配置项

参数|说明|类型|必填|默认值
---|---|---|---|---
id | console os 中应用 ID, 在加载应用的时候回根据这个配置的 id 唯一声明 | string | 是 | -
webpack5 | 针对 webpack 5 的配置优化 | boolean | 否 | -
webpack3 |  针对 webpack 3 的配置优化 | boolean | 否 | -
cssPrefix |  对 css 隔离的前缀 | string | 否 | 你填入的id
disableCssPrefix |  对 css 隔离的前缀 | boolean | 否 | false
disableOsCssExtends |  关闭 css 的 .os.css 的后置 | boolean | 否 | false
enableStandaloneBundle |  单独构建出 consoleos 的版本，会在你构建目录下的 microApp 中生成 consoleos 的 bundle | boolean | 否 | false

