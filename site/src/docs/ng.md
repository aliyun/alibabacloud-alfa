---
name: ng
tags: 
  ecosystem: true
zhName: 生态 - Angular
sort: 100
---

# Angular

## 子应用

对于子应用来说需要修改入口文件

```javascript

import { boostrap } from '@alicloud/console-os-ng-portal';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AppModule } from './app/app.module';

// 修改一下 入口
export default boostrap({
  bootstrapFunction: props => {
    return platformBrowserDynamic().bootstrapModule(AppModule);
  },
  template: '<app-root />',
  Router,
  NgZone: NgZone,
});

```

### 子应用构建修改

```javascript
// 需要自定义 webpack
import builder '@alicloud/console-os-ng-builder'
module.export = osBuild({
  /* 自定义 webpack */
})
```

打包构建之后会生成一个 https://g.alicdn.com/aliyun-next/vpc/manifest.json  的地址作为子应用的资源配置文件。

## 宿主应用

目前可以使用 NG 的 模块注册，主页一个 Alfa 的标签， 具体使用 Demo 请查看 ：
https://codesandbox.io/s/nameless-rain-1yv57

1.首先在 app/app.module.ts 中 注册模块

```typescript
import { ApplicationModule } from "@alicloud/console-os-ng-app";
@NgModule({
  // 其他配置
  imports: [
    /*
    * 其他配置
    */
    ApplicationModule
  ],
})
```
 
2.在使用的地方，使用 console-os-app 的标签加载应用

```html
<console-os-app
   id="os-example"
   manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json"
 >
 </console-os-app>
```

需要在 main.ts 中启动 Alfa 运行时：

```javascript
// 然后应用的入口调用
import { start } from '@alicloud/console-os-react-app';
start();
```