import axios from 'axios'
import router from '@/router'

const config = {
  baseUrl: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 1000,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
}

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.create(config)

// 默认post请求，使用application/json形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 封装post
axios.post = function (url, params) {
  return new Promise((resolve, reject) => {
    // console.log("****************************");
    axios({
      method: 'post',
      url: config.baseUrl + url,
      params,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(response => {
      if (response.status === 200) {
        // 根据实际情况进行更改
        resolve(response)
      } else {
        reject(response)
      }
    })
  })
}

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 响应拦截器
axios.interceptors.response.use(
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

export default axios
