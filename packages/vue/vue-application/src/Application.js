import {
  // OSApplication,
  createMicroApp, mount, load,
  // unmount, distroy
} from '@alicloud/console-os-kernal'
import vueCustomElement from 'vue-custom-element'
import Vue from 'vue'
Vue.use(vueCustomElement)
Vue.customElement('widget-vue');
const getParcelProps = (props = {}) => {
  const parcelProps = {...props, ...(props.appProps || {})};
  
  delete parcelProps.jsUrl;
  delete parcelProps.manifest;
  delete parcelProps.initialPath;
  delete parcelProps.externalsVars;
  delete parcelProps.sandBox;
  delete parcelProps.sandbox;
  delete parcelProps.appDidMount;
  
  return parcelProps;
}

export default {
  name: 'Application',
  props: {
    id: String,
    jsUrl: String,
    manifest: String,
    deps: {
      type: Array,
      default: () => [],
    },
    initialPath: String,
    singleton: Boolean,
    externalsVars: Array,
    disableBodyTag: Boolean,
    loading: Boolean,
    sandBox: {},
  },
  data() {
    return {
      hasError: false,
      // loading: true,
      nextThingToDo: Promise.resolve(),
      unmounted: false,
      error: null,
      app: null,
      el: document.createDocumentFragment()
    }
  },
  computed: {
    removeBodyTag() {
      return this.disableBodyTag || this.sandBox.disableFakeBody || false
    }
  },
  render(h) {
    const REF_NAME = 'el'
    const fragment = h('div', {
      ref: REF_NAME
    })
    if (this.removeBodyTag) {
      return h(this.id, {
        class: this.class,
        ref: 'el'
      }, [fragment])
    } else {
      return h(this.id, {
        class: this.class
      }, [h('body', {ref: REF_NAME})])
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.el = this.$refs.el
    })
    this.addThingToDo('mount', async () => {
      if (!this.id) {
        throw new Error('You should give a id for OS Application');
      }
      // make props for ConsoleOS app
      const appInfo = {
        url: this.jsUrl,
        id: this.id,
        manifest: this.manifest,
        externalsVars: this.sandBox.externalsVars,
        dom: this.el,
        deps: this.deps,
        customProps: {
          ...getParcelProps(this.$props)
        }
      }
      
      // call functions of ConsoleOS app
      const sandBox = this.sandBox;
      this.app = await createMicroApp(appInfo, {
        sandBox,
      })
      //
      await load(this.app);
      await mount(this.app, appInfo);
      this.loading = false;
      
      // dispatch appDidMount event
      this.$emit('appDidMount')
    })
  },
  updated() {
    console.log('vue host updated');
  },
  beforeDestroy() {
    console.log('vue host beforeDestroy');
  },
  methods: {
    addThingToDo(action, thing = () => {}) {
      if (this.hasError && action !== 'unmount') {
        return;
      }
      
      this.nextThingToDo = (this.nextThingToDo || Promise.resolve())
        .then((...args) => {
          if (this.unmounted && action !== 'unmount') {
            return;
          }
          return thing(...args);
        })
        .catch((err) => {
          this.nextThingToDo = Promise.resolve();
          const error = new Error(`During '${action}', os application threw an error: ${err.message}`)
          this.hasError = true;
          this.loading = false;
          this.error = error;
          this.$emit('appDidCatch', error);
          console.error(error);
        })
    }
  }
}
