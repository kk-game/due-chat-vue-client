<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { connectWebSocket } from '@/utils/websocket'
import { webHost } from '@/utils/const'

const router = useRouter()
const account = ref('admin123') // 设置默认值
const password = ref('admin123') // 设置默认值
const message = ref('')

const register = async () => {
  try {
    const response = await fetch(webHost + 'register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account: account.value,
        password: password.value,
        nickname: 'nickname' + Math.random().toString(36).substring(2, 7),
      }),
    })
    const result = await response.json()
    if (result.code === 0) {
      localStorage.setItem('account', account.value)
      localStorage.setItem('password', password.value)
      message.value = '注册成功，请登录'
    } else {
      message.value = `注册失败: ${result.message}`
    }
  } catch (error) {
    message.value = `注册失败: ${error}`
  }
}

const login = async () => {
  try {
    const response = await fetch(webHost + 'login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account: account.value, password: password.value }),
    })

    const result = await response.json()
    if (result.code !== 0) {
      message.value = `登录失败: ${result.message}`
      return
    }

    const back = result.data
    console.log(JSON.stringify(result.data))

    if (back.gate && back.token) {
      localStorage.setItem('account', account.value)
      localStorage.setItem('password', password.value)
      localStorage.setItem('gate', back.gate)
      localStorage.setItem('token', back.token)
      const wsUrl = `${back.gate}/?token=${back.token}`
      console.log('WebSocket URL:', wsUrl)
      connectWebSocket(
        wsUrl,
        () => {
          message.value = '登录成功，正在跳转...'
          router.push('/home')
        },
        () => {
          message.value = 'WebSocket 连接失败'
        },
      )
    } else {
      message.value = '登录失败'
    }
  } catch (error) {
    message.value = `登录失败: ${error}`
  }
}
</script>

<template>
  <div class="login">
    <div class="login-container">
      <h1>登录或注册</h1>
      <input v-model="account" type="text" placeholder="账号" />
      <input v-model="password" type="password" placeholder="密码" />
      <div class="button-group">
        <button @click="register">注册</button>
        <button @click="login">登录</button>
      </div>
      <p class="message">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.login {
  position: fixed; /* 确保页面盛满整个屏幕 */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #0288c6, #5a2ac3);
  overflow: hidden;
}

.login-container {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333;
}

input {
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #74ebd5;
  box-shadow: 0 0 4px rgba(116, 235, 213, 0.5);
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

button {
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  color: #fff;
  background: #74ebd5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #67d8c4;
}

button:active {
  background: #5cc2b0;
}

.message {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #e74c3c;
}
</style>
