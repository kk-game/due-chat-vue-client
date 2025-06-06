import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { RouteChat, RouteHome, RouteHomeName, RouteLogin, RouteLoginName } from '@/utils/const'
import ChatView from '@/views/ChatView.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: RouteLogin,
      name: RouteLoginName,
      component: LoginView,
    },
    {
      path: RouteHome,
      name: RouteHomeName,
      component: HomeView,
    },
    {
      path: RouteChat,
      name: RouteChat,
      component: ChatView,
    }
  ],
})

// // 确保刷新时总是从启动流程开始
// router.beforeEach((to, from, next) => {
//   if (to.name !== 'login' && !localStorage.getItem('account')) {
//     next({ name: 'login' })
//   } else {
//     next()
//   }
// })

export default router
