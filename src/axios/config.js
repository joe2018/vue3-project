import axios from 'axios'
import router from '@/router'
import qs from 'qs'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 1000
})

// 2.请求拦截器
api.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
  if (config.method.toLowerCase() === 'get') { // 配置get请求数据(这里是容错处理)
    if (config.data !== undefined) config.params = config.data
  }
  // 防止post请求，后端无法接收参数问题（方式一）
  if (config.method.toLowerCase() === 'post') { // post请求配置数据转换和请求头
    config.data = qs.stringify(config.data) // 数据转化,也可以使用qs转换
  }
  return config
}, error => {
  Promise.reject(error)
})

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 对响应数据做一些事情
    return response
  },
  error => {
    // 请求错误时做些事
    let status = ''
    if (error.request) {
      status = error.request
    } else if (error.response) {
      status = error.response
    }
    if (status) {
      switch (status.status) {
        case 400:
          error.message = '请求错误(400)'
          break
        case 401:
          error.message = '未授权，请重新登录(401)'
          router.push('/401')
          break
        case 403:
          error.message = '拒绝访问(403)'
          break
        case 404:
          error.message = '请求出错(404)'
          break
        case 408:
          error.message = '请求超时(408)'
          break
        case 500:
          error.message = '服务器错误(500)'
          break
        case 501:
          error.message = '服务未实现(501)'
          break
        case 502:
          error.message = '网络错误(502)'
          break
        case 503:
          error.message = '服务不可用(503)'
          break
        case 504:
          error.message = '网络超时(504)'
          break
        case 505:
          error.message = 'HTTP版本不受支持(505)'
          break
        default:
          error.message = `连接出错(${error.response.status})!`
      }
    } else {
      error.message = '连接服务器失败!'
    }
    return Promise.reject(error)
  })

export default api
