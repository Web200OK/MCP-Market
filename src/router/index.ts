import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import MCPMarket from '../components/MCPMarket.vue'
import MCPDetail from '../components/MCPDetail.vue'
import DebugPage from '../views/DebugPage.vue'
import SubmitPage from '../views/SubmitPage.vue'
import APIPage from '../views/APIPage.vue'
import PermissionPage from '../views/PermissionPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: MCPMarket,
    meta: { title: '首页' }
  },
  {
    path: '/debug',
    name: 'debug',
    component: DebugPage,
    meta: { title: '调试' }
  },
  {
    path: '/submit',
    name: 'submit',
    component: SubmitPage,
    meta: { title: '提交' }
  },
  {
    path: '/api',
    name: 'api',
    component: APIPage,
    meta: { title: '应用程序API' }
  },
  {
    path: '/permission',
    name: 'permission',
    component: PermissionPage,
    meta: { title: '权限' }
  },
  {
    path: '/mcp-details/:id',
    name: 'mcp-details',
    component: MCPDetail,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
