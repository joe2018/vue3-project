import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import installElementPlus from './plugins/element.js'
import api from './axios/config.js'
import * as ElIcons from '@element-plus/icons'

// 导入全局样式
import './assets/css/global.css'

window.router = router

const app = createApp(App)
for (const name in ElIcons) {
  app.component(name, (ElIcons)[name])
}
installElementPlus(app)
app.config.globalProperties.$api = api
app.use(store).use(router).mount('#app')
