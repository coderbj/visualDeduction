import { createApp } from 'vue'
import 'normalize.css'
import './assets/css/index.css'
import pinia, {setupStores} from './store'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'animate.css'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'



const app = createApp(App)
app.use(router)
app.use(pinia)
setupStores()
app.use(ElementPlus, {locale: zhCn})
app.mount('#app')
