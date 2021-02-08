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

添加 Vue Cli Alfa 插件:

```bash
> npm install vue-cli-plugin-console-os -D
# or
> yarn add vue-cli-plugin-console-os -D
```

在 ```vue.config.js``` 增加 Alfa 插件配置

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

## 宿主应用


### 安装依赖

```bash
> npm install @alicloud/console-os-vue-host-app
# or
> yarn add @alicloud/console-os-vue-host-app
```

### 修改main.js

```javascript
import Vue from 'vue'
import App from './App.vue'

import {start} from '@alicloud/console-os-vue-host-app'

// 启动宿主应用的运行时
start({
  // 沙箱配置
  sandBox: {
    // true: 关闭沙箱, false: 打开沙箱
    // 关闭沙箱之后，点击路由你可以看到路由发生了变化
    // 再次开启之后，可以看到路由没有发生变化
    disable: true,
    // 宿主变量白名单
    externalsVars: ["Zone"],
    // 沙箱初始地址
    // initialPath: '/'
  },
  // 注入应用依赖
});

new Vue({
  render: h => h(App),
}).$mount('#app')

```

### 修改Vue组件
与[React宿主应用](https://aliyun.github.io/alibabacloud-alfa/guides/react#%E5%AE%BF%E4%B8%BB%E5%BA%94%E7%94%A8 )一样，需要知道接入子应用的`manifest`文件的地址。

```vue
<template>
  <div class="react">
    <Application
        id="os-example"
        class="test-class"
        :sandBox="{
          initialPath: '/dashboard',
          disableFakeBody: true,
          disable: false
        }"
        manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json"
    />
  </div>
</template>

<script>
// 引入@alicloud/console-os-vue-host-app依赖
import Application from '@alicloud/console-os-vue-host-app'

export default {
  name: 'App',
  components: {
    Application
  },
}
</script>
```


