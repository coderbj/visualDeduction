import { createPinia } from 'pinia'
import {useResourceStore} from './resource'
import {useGlobalStore} from './global'
import { useUserStore } from './user.ts'

const pinia = createPinia()

export function setupStores() {
  useResourceStore()
  useGlobalStore()
  useUserStore()
}

export default pinia