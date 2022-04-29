import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/components/icon/index'

export default (app) => {
  app.use(ElementPlus, { locale })
}
