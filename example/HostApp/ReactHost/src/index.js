import React from "react";
import ReactDOM from "react-dom";

// 加载 console os 的依赖
import Application, { start } from "@alicloud/console-os-react-app";

// ng 的依赖
import "core-js";
import "zone.js/dist/zone";

import "./styles.css";

function App() {
  return (
    <div className="App">
      {/* 渲染应用 */}
      <div className="react">
        <Application
          id="os-example"
          sandbox={{
            initialPath: "/dashboard",
            disableFakeBody: true,
          }}
          appDidCatch={(e) => {
            console.log(e)
          }}
          // src="http://localhost:8080/img/logo.82b9c7a5.png"
          manifest="http://localhost:8082/os-example.manifest.json"
        />
      </div>

      <div className="vue">
        <Application
          testProps="ssss"
          id="os-example-vue"
          manifest="http://localhost:8080/os-example-vue.manifest.json"
        />
      </div>

      <div className="ng">
        <Application
          id="os-exmaple-angular"
          manifest="http://localhost:4200/os-exmaple-angular.manifest.json"
        />
      </div>

    </div>
  );
}

window.title = "ALIYUN";

start({
  // 沙箱配置
  sandbox: {
    // true: 关闭沙箱, false: 打开沙箱
    // 关闭沙箱之后，点击路由你可以看到路由发生了变化
    // 再次开启之后，可以看到路由没有发生变化
    disable: false,
    // 宿主变量白名单
    externalsVars: ["Zone"],
    // 沙箱初始地址
    // initialPath: '/'
  },
  // 注入应用依赖
  deps: {
    react: React,
    "react-dom": ReactDOM
  }
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
