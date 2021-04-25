import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
// 导入全局样式表
import '../assets/css/global.css'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/Login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, form, next) => {
  // to  将要访问的函数
  // form 代表从哪个路径跳转而来
  // next 是个函数 表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
