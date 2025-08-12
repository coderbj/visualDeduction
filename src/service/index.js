// service/index.js 请求实例的统一出口
import HYRequest from './request'
import {TIME_OUT} from './request/config'


const hyRequest = new HYRequest({
  baseURL:BASE_URL,
  timeout:TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      // 携带token的拦截
      // const token= '' // token从vuex state或localStorage获取
      // if(token) {
      //   config.headers.authorization= `Bearer ${token}`
      // }
      // const user = sessionCache.getItem('userInfo')
      // if(user && user.UserName) {
      //   config.headers.authorization = `${user.UserName}`
      // }
      return config
    },
    requestInterceptorCatch: (err) => {
      return err
    },
    responseInterceptor: (res) => {
      return res.data
    },
    responseInterceptorCatch: (err) => {
      return err
    }
  }
})


export {
  hyRequest,
}
