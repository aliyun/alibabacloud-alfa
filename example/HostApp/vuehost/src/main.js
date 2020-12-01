import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import {start} from '@alicloud/console-os-vue-host-app'

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
