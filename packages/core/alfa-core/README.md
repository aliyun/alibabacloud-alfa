# Alfa Core

符合阿里集团微前端标准 API 的微前端框架 `@alicloud/alfa-core`。

这是一个偏底层的包，建议使用更上层的包以简化开发：
- `@alicloud/alfa-react`（适用于 React 项目）

## 如何使用

### 引入你的项目

```bash
npm i @alicloud/alfa-core --save
# or
yarn add @alicloud/alfa-core --save
# or
tnpm i @alicloud/alfa-core --save
```

### 加载和渲染微应用

```jsx
import React, { useEffect, useRef } from 'react';
import { createMicroApp } from '@alicloud/alfa-core';

// 微应用的资源描述。单独提出来是因为这部分内容一般来自于平台服务，而不会写死在代码中
const exampleAppManifest = {
  "name": "example",
  "entry": {
    "scripts": ["https://example.com/example.js"],
    "styles": ["https://example.com/example.css"]
  }
};

// 主应用使用 React 实现
function HostApp(props) {
  
  const exampleApp = createMicroApp({
    // 资源描述是微应用至少需要的配置项，更多的配置项参考 API 文档
    ...exampleAppManifest
  });
  
  const containerEl = useRef(null);
  
  useEffect(() => {
    // 加载
    exampleApp
      .load()
      .then((exampleApp) => {
        // 渲染
        exampleApp.mount(containerEl.current, {
          title: `${props.title} - ${exampleApp.name}`
        });
      });
    // 卸载
    return () => {
      exampleApp.unmount();
    };
  }, []);
  
  useEffect(() => {
    // 更新
    exampleApp.update({
      title: `${props.title} - ${exampleApp.name}`
    });
  }, [props.title]);
  
  return (
    <div ref={containerEl}></div>
  );
  
}
```

### 指定远程 Manifest 加载子应用

```jsx
import React, { useEffect, useRef } from 'react';
import { createMicroApp } from '@alicloud/alfa-core';

const exampleAppManifest = 'https://somewhere/index.manifest.json'

// 主应用使用 React 实现
function HostApp(props) {
  
  const exampleApp = createMicroApp({
    // 资源描述是微应用至少需要的配置项，更多的配置项参考 API 文档
    name: 'appName',
    manifest: exampleAppManifest
  });
  
  const containerEl = useRef(null);
  
  useEffect(() => {
    // 加载
    exampleApp
      .load()
      .then((exampleApp) => {
        // 渲染
        exampleApp.mount(containerEl.current, {
          title: `${props.title} - ${exampleApp.name}`
        });
      });
    // 卸载
    return () => {
      exampleApp.unmount();
    };
  }, []);
  
  useEffect(() => {
    // 更新
    exampleApp.update({
      title: `${props.title} - ${exampleApp.name}`
    });
  }, [props.title]);
  
  return (
    <div ref={containerEl}></div>
  );  
}
```