import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { connectWebSocket } from '@/utils/websocket'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const initializeApp = async () => {
  const account = localStorage.getItem('account')
  const password = localStorage.getItem('password')
  const gate = localStorage.getItem('gate')
  const token = localStorage.getItem('token')

  if (!account || !password) {
    router.replace('/') // 如果没有账号和密码，跳转到登录界面
  } else if (gate && token) {
    // 如果有 gate 和 token，尝试登录
    const wsUrl = `${gate}/?token=${token}`
    connectWebSocket(
      wsUrl,
      () => {
        console.log('WebSocket 连接成功')
        router.replace('/home') //登录成功后跳转到主界面
      },
      () => {
        console.error('WebSocket 连接失败')
        localStorage.removeItem('gate')
        localStorage.removeItem('token')
        router.replace('/') //登录失败，跳转到登录界面
      },
    )
  } else {
    // 如果没有 gate 和 token，跳转到登录界面
    router.replace('/')
  }
}

router.isReady().then(() => {
  initializeApp()
  app.mount('#app')
})

// 处理全局错误
app.config.errorHandler = (err) => {
  console.error('全局错误:', err)
}
