import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import installElementPlus from './plugins/element.js'
import api from './axios/config'

// 导入全局样式
import './assets/css/global.css'

window.router = router

const app = createApp(App)
installElementPlus(app)
app.config.globalProperties.$api = api
app.use(store).use(router).mount('#app')
