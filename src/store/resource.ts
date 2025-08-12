import {defineStore} from 'pinia'
import { ref } from 'vue'
export const useResourceStore = defineStore('resource', ()=> {
  // 当前要创建的资源
  const creatingRes = ref({})
  // 当前资源的序号-用于选中效果
  const currentResourceIndex = ref(-1)
  // 记录画板中选中图形的parentIndex
  const parentIndex = ref('')
  // 当前tabName用于创建图形时赋值给图形的parentIndex属性，匹配属性菜单
  const tabName = ref('')
  // 设置当前资源类别index
  const setParentIndex = (index: string) => {
    parentIndex.value = index
  }
  // 设置当前tabName用于创建图形时赋值给图形的parentIndex属性，匹配属性菜单
  const setTabName = (name: string) => {
    tabName.value = name
  }
  // 当前要创建的资源
  const setCreatingRes = (res: any) => {
    creatingRes.value = res
  }
  // 清空当前要创建的资源
  const clearCreatingRes = () => {
    creatingRes.value = {}
  }
  // 设置当前资源的序号
  const setCurrentResourceIndex = (index: number) => {
    currentResourceIndex.value = index
  }

  return {
    creatingRes,
    setCreatingRes,
    clearCreatingRes,
    currentResourceIndex,
    setCurrentResourceIndex,
    parentIndex,
    setParentIndex,
    tabName,
    setTabName,
  }
})