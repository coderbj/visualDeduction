// service/request/index.js 封装请求类
import axios from 'axios'

class HYRequest {
  // axios实例
  constructor(config = {}) {
    this.instance = axios.create(config)
    // 从config中取出的拦截器是对应的实例独享的拦截器
    this.interceptors = config.interceptors ?? null
    if (this.interceptors) {
      // 每个拦截器中包含请求/响应的成功/失败两个回调函数
      if (this.interceptors.requestInterceptor && this.interceptors.requestInterceptorCatch) {
        this.instance.interceptors.request.use(
          this.interceptors.requestInterceptor, this.interceptors.requestInterceptorCatch)
      }
      if (this.interceptors.responseInterceptor && this.interceptors.responseInterceptorCatch) {
        this.instance.interceptors.response.use(
          this.interceptors.responseInterceptor, this.interceptors.responseInterceptorCatch)
      }
    }

    // 添加所有实例共享的拦截器
    this.instance.interceptors.request.use((config) => {
      return config
    }, (err) => {
      return err
    })
    this.instance.interceptors.response.use((res) => {
      return res
    }, (err) => {
      return err
    })
  }

  // 请求方法
  request(config) {
    return new Promise((resolve, reject) => {
      // ?先判断config中有无interceptors,如果有，从中取requestInterceptor
      // 单个请求方法独享的拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }

      this.instance.request(config).then(res => {
        if (config.interceptors?.responseInterceptor) {
          res = config.interceptors.responseInterceptor(res)
        }
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }

  get(config) {
    return this.request({...config,method:'GET'})
  }

  post(config) {
    return this.request({...config,method:'POST'})
  }

  delete(config) {
    return this.request({...config,method:'DELETE'})
  }

  patch(config) {
    return this.request({...config,method:'PATCH'})
  }
}

export default HYRequest
