---
name: Vue
tags: 
  ecosystem: true
zhName: 生态 - Vue
sort: 101
---

# Vue

## 子应用

替换 ```new Vue(/*options*/)``` 成 ```@alicloud/console-os-vue-portal``` 的 ```mount(/*options*/)```  方法， 并同时导出 ```mount ``` 的返回。

```javascript
import { mount } from '@alicloud/console-os-vue-portal';
import App from './App.vue'
// export the return
export default mount({
    el: '#app',
    i18n,
    router,
    store,
    render: h => h(App),
    created() {}
})
```

### 子应用构建修改

添加 Vue Cli ConsoleOS 插件:

```bash
> npm install vue-cli-plugin-console-os -D
# or
> yarn add vue-cli-plugin-console-os -D
```

在 ```vue.config.js``` 增加 ConsoleOS 插件配置

```javascript
module.export = {
  // 你的其他配置
  pluginOptions: {
    consoleOs: {
      id: 'rightcloud-costmgmt'
    }
  }
}
```
