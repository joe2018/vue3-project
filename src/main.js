import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import installElementPlus from './plugins/element.js'
import api from './axios/config.js'
import * as ElIcons from '@element-plus/icons'
import dayjs from 'dayjs'

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

// 添加全局日期过滤器vue3.0的写法
app.config.globalProperties.$filters = {
  format (value) {
    if (value) {
      return dayjs(value).format('YYYY-MM-DD hh:mm:ss')
    } else {
      return ''
    }
  }
}
