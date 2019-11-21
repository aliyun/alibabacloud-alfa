## 说明

虚拟化部分浏览器内置对象。

```javascript
import { createContext, removeContext } from 'path/to/browser-vm';

( async (){
  // 创建一个 context
  const context = await createContext( { initURL: 'https://www.example.com/home', externals: [ 'varA', 'varB', 'ALIYUN_CONSOLE_CONFIG' ] } );
  const { window, location, history, document } = context;

  // 销毁一个 context
  await removeContext( context );
} )();
```