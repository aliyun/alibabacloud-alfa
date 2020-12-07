---
name: optimization
zhName: 优化
tags: 
  advance: true
sort: 5
---
# 性能优化
## 背景

通常情况下为了减小应用体积，我们希望抽离出一些公共的三方库，只在宿主中做加载。

## 子应用外置依赖

首先你需要在构建的时候剔除掉你依赖的三方库；

```javascript
// 你的子应用的库
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
```

## 宿主中植入依赖

然后你需要在宿主应用加载的时候指定你要共享的三方依赖

```javascript
import React from 'react';
import ReactDom from 'react-dom';

start({
  deps: {
    'react': React
    'react-dom': ReactDom
  }
})

```

## 共享自己项目中的业务库

你也可以注入你自己的业务依赖，假设你的子应用中使用如下的一个组件, 你现在希望所有的子应用都共享宿主中的一份代码，可以参照如下做法

### 子应用

你需要配置一下你的webpack alias 配置

```diff
-import A from './components/A';
+import A from 'A';

return () => <A/>
```

然后添加 external.

```javascript
// 你的子应用的库
config.externals = {
  A: {
    root: 'A',
    commonjs2: 'A',
    commonjs: 'A',
    amd: 'A',
  }
```

这样 A 在打包的时候就不会被打包进到子应用的代码中。

### 宿主:

你可以把刚才的 ./component/A 移到宿主代码中， 然后在宿主代码中注入，

```
import A from './component/A';

start({
	deps: {
    A: A,
  }
})
```