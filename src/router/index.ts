import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const Login = () => import('@/views/Login.vue')
const Drawing = () => import('../views/Drawing.vue')
const Entry = () => import('../views/Entry.vue')
const EnvSetup = () => import('../views/EnvSetup.vue')
const Library = () => import('../views/Library.vue')
const LibraryType = () => import('../views/LibraryType.vue')
const LibraryList = () => import('../views/LibraryList.vue')
const LibraryAdd = () => import('../views/LibraryAdd.vue')
const LibraryBatch = () => import('../views/LibraryBatch.vue')
const TaskRecords = () => import('../views/TaskRecords.vue')
const User = () => import('../views/User.vue')
const Help = () => import('../views/Help.vue')
const Share = () => import('../views/Share.vue')
const School = () => import('../views/School.vue')
const ShareList = () => import('../views/ShareList.vue')
const ShareInfo = () => import('../views/ShareInfo.vue')


// 配置路由和组件的映射关系
const routes:RouteRecordRaw[] = [
  {path: '/', redirect: '/entry'},
  {path: '/login', component: Login, name: 'login', meta: {title: '可视化推演-管理员登录'}},
  {path: '/entry', component: Entry, name: 'entry', meta: {title: '可视化推演-入口'}},
  {path: '/env-setup', component: EnvSetup, name: 'env-setup', meta: {title: '可视化推演-环境配置'}},
  {path: '/drawing', component: Drawing, name: 'drawing', meta: {title: '可视化推演-画板'}},
  {path: '/library', component: Library, name: 'library', meta: {title: '可视化推演-要素库管理'}},
  {path: '/library-type', component: LibraryType, name: 'library-type', meta: {title: '可视化推演-要素类型'}},
  {path: '/library-list', component: LibraryList, name: 'library-list', meta: {title: '可视化推演-要素列表'}},
  {path: '/library-add', component: LibraryAdd, name: 'library-add', meta: {title: '可视化推演-要素添加'}},
  {path: '/library-batch', component: LibraryBatch, name: 'library-batch', meta: {title: '可视化推演-批量上传'}},
  {path: '/task-records', component: TaskRecords, name: 'task-records', meta: {title: '可视化推演-推演记录'}},
  {path: '/user', component: User, name: 'user', meta: {title: '可视化推演-用户管理'}},
  {path: '/help', component: Help, name: 'help', meta: {title: '可视化推演-操作说明'}},
  {path: '/share', component: Share, name: 'share', meta: {title: '可视化推演-推送'}},
  {path: '/school', component: School, name: 'school', meta: {title: '可视化推演-学习'}},
  {path: '/share-list', component: ShareList, name: 'share-list', meta: {title: '可视化推演-交底信息'}},
  {path: '/share-info', component: ShareInfo, name: 'share-info', meta: {title: '可视化推演-交底信息'}},
  // 404页面，必须放在最后
  {path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue'), meta: {title: '404'}},
]
// 创建路由实例
const router = createRouter({
  routes,
  history: createWebHashHistory()
})

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  if(to.meta.title) {
    document.title = to.meta.title as string
  }
  // 如果用户访问的是登录页，直接放行
  // 如果用户访问的不是登录页，判断用户是否登录
  if(to.path !== '/login') {
    const userInfo = sessionStorage.getItem('userInfo')
    if (!userInfo||Object.keys(JSON.parse(userInfo)).length === 0) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

// 导出路由实例
export default router