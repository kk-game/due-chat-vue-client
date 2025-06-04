import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CreateRoomView.vue'),
    },
  ],
})

// 确保刷新时总是从启动流程开始
router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('account')) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
