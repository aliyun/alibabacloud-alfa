# Console OS Vue Portal

## Basic Use

Replace the ```new Vue(/*options*/)``` to ```mount(/*options*/)``` function in ```@alicloud/console-os-vue-portal```. and export the return value of the mount.

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

## Build

add the ```vue-cli-plugin-os``` to the dev dependencies.

```bash
> npm install vue-cli-plugin-os -D
# or
> yarn add vue-cli-plugin-os -D
```