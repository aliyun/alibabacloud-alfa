<template>
    <div id="vue-host" class="App">
      <div class="react">
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
      </div>
    </div>
</template>

<script>
import Application from '@alicloud/console-os-vue-host-app'

export default {
  name: 'App',
  components: {
    Application
  },
}
</script>

<style>
.App {
  font-family: sans-serif;
  text-align: center;
}

.vue {
  border: 4px solid #41b883;
}

.react {
  border: 4px solid #ff6a00;
  margin-bottom: 2px;
}

.ng {
  border: 4px solid #eeeeee;
  margin-bottom: 2px;
}
</style>
