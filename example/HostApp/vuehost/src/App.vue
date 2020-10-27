<template>
    <div id="vue-host" class="App">
      <div class="react">
        <Application
            id="os-example"
            :sandBox="{
              initialPath: '/dashboard',
              disableFakeBody: true,
            }"
        manifest="http://localhost:8081/os-example.manifest.json"
        />
      </div>

      <div class="vue">
        <Application
            id="os-example-vue"
            manifest="http://localhost:8082/os-example-vue.manifest.json"
        />
      </div>

      <div class="ng">
        <Application
            id="os-exmaple-angular"
            manifest="http://localhost:4200/os-exmaple-angular.manifest.json"
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
  }
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
