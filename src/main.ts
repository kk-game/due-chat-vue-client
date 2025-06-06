import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { EvtUpdateRoomList, RoomsNotify, RouteHome, RouteLogin, TokenValidate } from './utils/const'
import type { SingleRoomInfo } from './utils/type_struct'
import { roomInfoStore } from './utils/app_data'
import { MsgMgr } from './utils/websocket'
import emitter from './utils/mitt_evt'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const initializeApp = async () => {
  MsgMgr.Register(TokenValidate, (message) => {//请求登陆
    console.log('Token 验证成功:', JSON.stringify(message))
  })

  MsgMgr.Register(RoomsNotify, (message) => {
    roomInfoStore().setRoomInfo(message as SingleRoomInfo[])
    console.log('房间信息更新:', JSON.stringify(message))
    router.replace(RouteHome) //登录成功后跳转到主界面
    emitter.emit(EvtUpdateRoomList, message)
  })

  const gate = localStorage.getItem('gate')
  const token = localStorage.getItem('token')
  if (gate && gate.length > 0 && token && token.length > 0) {
    // 如果有 gate 和 token，尝试登录
    const wsUrl = `${gate}/?token=${token}`
    MsgMgr.StartConnect(wsUrl, () => {
      localStorage.removeItem('gate')
      localStorage.removeItem('token')
      router.replace(RouteLogin) //登录失败，跳转到登录界面
    })
  } else {
    //没有相关的信息直接打开登陆界面
    router.replace(RouteLogin)
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
