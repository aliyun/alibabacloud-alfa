import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { mount } from '@alicloud/console-os-vue-portal'

Vue.config.productionTip = false

export default mount({
  el: '#app',
  router,
  render: h => h(App)
})
