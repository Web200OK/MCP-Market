import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/src/index.scss';
import '@/assets/global.css'
import './styles/element-plus-theme/index.scss';
import './styles/dark.scss';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from './store'
import router from './router'

const app = createApp(App)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Add TypeScript type declarations
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: typeof store
    $router: typeof router
  }
}

app.use(ElementPlus)
   .use(store)
   .use(router)
   .mount('#app')
