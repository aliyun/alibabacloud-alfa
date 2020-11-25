# @alicloud/console-os-vue-host-app
Host application component Vue edition

## How to use
```vue
<template>
    <Application
        id="os-example"
        class="test-class"
        :sandBox="{
          initialPath: '/dashboard',
          disableFakeBody: true,
          disable: false
        }"
        manifest="https://g.alicdn.com/ConsoleOS/OSExample/0.0.2/os-example.manifest.json"
    />
</template>
<script >
import Application from '@alicloud/console-os-vue-host-app'
export default {
  name: 'Example',
  components: {
    Application
  }
}
</script>
```

## Props

| property | type | description |
| ------ | --------- | --------------- |
| id | string | id for sub application |
| sandBox | object | sandbox options, same as react-host-app |
| manifest | string | sub application url for summarizing sub application |
| externalsVars | string |  global variables injection for sub application |
| disableBodyTag | boolean | disable body tag |
| initialPath | string | initial router path for sub application | 
| singleton | boolean | enable singleton mode |

