import {
  // OSApplication,
  createMicroApp,
  mount,
  load,
  unmount,
  distroy
} from '@alicloud/console-os-kernal'
import vueCustomElement from 'vue-custom-element'
import Vue from 'vue'
Vue.use(vueCustomElement)
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
export { start, createEventBus, prefetch, loadExposedModule } from '@alicloud/console-os-kernal';

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
    disableBodyTag: {
      type: Boolean,
      default: false,
    },
    loading: Boolean,
    sandBox: {},
  },
  data() {
    return {
      hasError: false,
      subLoading: true,
      nextThingToDo: Promise.resolve(),
      unmounted: false,
      error: null,
      app: null,
      el: document.createDocumentFragment(),
      createdDomElement: null,
    }
  },
  computed: {
    removeBodyTag() {
      return this.disableBodyTag || this.sandBox.disableFakeBody || false
    }
  },
  render(h) {
    const _this = this
    const loadingContent = this.$slots.loading
    Vue.customElement(this.id, {
      render: function (createNode) {
        const innerContent  = _this.subLoading ? loadingContent : this.$slots.default
        if (!_this.removeBodyTag) {
          return createNode('body', innerContent)
        }
        return innerContent
      }
    });
    if (this.error) {
      if (this.$slots.error) {
        return this.$slots.error
      }
      return h('pre', { style: { color: 'red' }}, this.error.stack)
    }
    return h(this.id, {
      class: this.class,
      ref: 'el'
    })
  },
  mounted() {
    this.$nextTick(() => {
      if (this.removeBodyTag) {
        this.el = this.$refs.el
      } else {
        const [body] = this.$refs.el.children
        this.el = body
      }
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
      this.subLoading = false;
      await mount(this.app, appInfo);
  
      // dispatch appDidMount event
      this.$emit('appDidMount')
    })
  },
  updated() {
    this.addThingToDo('update', () => {
      // @ts-ignore
      if (this.app && this.app.parcel && this.app.parcel.update) {
        // @ts-ignore
        return this.app.update(getParcelProps(this.$props))
      }
    })
  },
  beforeDestroy() {
    this.addThingToDo('unmount', () => {
      const { singleton = true } = this.$props;
      if (this.app && this.app.parcel && this.app.parcel.getStatus() === "MOUNTED") {
        return singleton ? unmount(this.app) : distroy(this.app);
      }
    })
  
    if (this.createdDomElement && this.createdDomElement.parentNode) {
      this.createdDomElement.parentNode.removeChild(this.createdDomElement)
    }
  
    this.unmounted = true
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
          this.subLoading = false;
          this.error = error;
          this.$emit('appDidCatch', error);
          console.error(error);
        })
    }
  }
}

