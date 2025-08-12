import {defineStore} from 'pinia'
import {Ref, ref} from 'vue'
import {useSessionStorage} from '@vueuse/core'

interface IUserInfo {
  BianHao?: string
  id?:number
  name?: string
  username?: string
}

export const useUserStore = defineStore('user', ()=> {
  const userInfoStorage = useSessionStorage('userInfo', {}) // 用户信息存储
  const userInfo: Ref<IUserInfo> = ref(userInfoStorage.value) // 用户信息
  // 设置用户信息
  const setUserInfo = (info:IUserInfo) => {
    delete info['password']
    userInfo.value = info
    userInfoStorage.value = info
  }
  // 清空用户信息
  const clearUserInfo = () => {
    userInfo.value = {}
    sessionStorage.removeItem('userInfo')
  }

  return {
    userInfo,
    setUserInfo,
    clearUserInfo,
  }
})