import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element.js'
import api from './axios/config'

// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

const app = createApp(App)
installElementPlus(app)
app.config.globalProperties.$api = api
app.use(store).use(router).mount('#app')
