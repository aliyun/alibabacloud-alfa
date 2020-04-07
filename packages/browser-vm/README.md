# @alicloud/console-os-browser-vm

## 安装

``` bash
> npm install @alicloud/console-os-browser-vm --save
```

## 说明

直接执行代码：

``` javascript
import { eval } from '@alicloud/console-os-browser-vm';

const context = eval('window.test = 1;')

console.log(window.test === undefined) // true
```

获取虚拟化部分浏览器内置对象。

```javascript
import { createContext, removeContext } from '@alicloud/console-os-browser-vm';

const context = await createContext();

const run = window.eval(`
  (() => function({window, history, locaiton, document}) {
    window.test = 1;
  })()
`)

console.log(context.window.test);
console.log(window.test);

// 操作虚拟化浏览器对象
context.history.pushState(null, null, '/test');
context.locaiton.hash = 'foo'

// 销毁一个 context
await removeContext( context );
```