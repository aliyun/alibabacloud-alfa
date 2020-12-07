
# 共享子应用模块

有时候为了从分治的角度出发，子应用的业务逻辑经常维护在子应用内部。但是有时候往往会出现宿主希望使用子应用中的某个逻辑或者组件，但是又不希望重新拷贝一份代码的情况。

为了解决类似这种复用的问题， `Alfa` 中提供了一个 low level 的 API 帮你你共享子应用中的某些模块代码。这些被共享出去的模块被称为 `exposedModule`。

## 子应用导出共享模块

首先你需要在子应用中的代码中利用 `registerExposedModule` 显示的声明你要导出的模块. 如下面的代码所示

```javascript
import About from './About';
import restartECS from './restartECS'
import { registerExposedModule } from '@alicloud/console-os-react-portal';

// 注册子应用的模块
registerExposedModule('About', About);
registerExposedModule('restart', restartECS);

```

## 宿主消费共享模块

然后你可以通过 `loadExposedModule` 的方法来在宿主中消费子应用中的注册的模块，如下所示。

```javascript
// 宿主
const appInfo = {
  id: 'os-example',
  manifest: 'http://g.alicdn.com/ConsoleOS/OSExample/0.0.5/os-example.manifest.json'
}

// 使用组件
const About = lazy<React.FC<{test: string}>>(
  () => loadExposedModule(appInfo, 'About').then((c) => ({ default: c }))
);

// 使用导出函数
const restartServer = async () => {
  const restartECS = await loadExposedModule(appInfo, 'restart');
  restartECS(/*instanceID*/) 
}

const App = () => {
  return (
    <>
      <Suspense fallback={<div>loading</div>}>
        <About test="1" />
      </Suspense>
    </>
  )
}
```

这个例子中，我们消费了子应用中导出的一个组件，一个方法。对于 React 组件我们可以利用 `lazy` & `Suspense` 来消费。 对于一般的方法就可以直接调用方法的形式来使用。