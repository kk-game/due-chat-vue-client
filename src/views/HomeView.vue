<script setup lang="ts">
import { ref } from 'vue'
import ListView from './ListView.vue'
import ContactView from './ContactView.vue'
import SelfView from './SelfView.vue'

const chatStr = 'chat'
const contactStr = 'contact'
const selfStr = 'self'
const currentTab = ref('chat')
const activeColor = '#42b983'
const inactiveColor = '#888'

const getIconColor = (tab: string) => (currentTab.value === tab ? activeColor : inactiveColor)

// const showModal = ref(false)

// // 浮动按钮位置
// const pos = ref({ x: 300, y: window.innerHeight - 120 })

// let isDragging = false
// let offsetX = 0
// let offsetY = 0

// const startDrag = (e: MouseEvent | TouchEvent) => {
//   isDragging = true
//   const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
//   const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
//   offsetX = clientX - pos.value.x
//   offsetY = clientY - pos.value.y

//   document.addEventListener('mousemove', onDrag)
//   document.addEventListener('mouseup', stopDrag)
//   document.addEventListener('touchmove', onDrag, { passive: false })
//   document.addEventListener('touchend', stopDrag)
// }

// const onDrag = (e: MouseEvent | TouchEvent) => {
//   if (!isDragging) return
//   const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
//   const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

//   pos.value.x = Math.min(window.innerWidth - 60, Math.max(0, clientX - offsetX))
//   pos.value.y = Math.min(window.innerHeight - 100, Math.max(0, clientY - offsetY))
// }

// const stopDrag = () => {
//   isDragging = false
//   document.removeEventListener('mousemove', onDrag)
//   document.removeEventListener('mouseup', stopDrag)
//   document.removeEventListener('touchmove', onDrag)
//   document.removeEventListener('touchend', stopDrag)
// }

// const changeModelValue = (value: boolean) => {
//   showModal.value = value
// }
</script>

<template>
  <div class="app-container">
    <main class="main-content">
      <keep-alive>
        <component
          :is="
            currentTab === chatStr ? ListView : currentTab === contactStr ? ContactView : SelfView
          "
        />
      </keep-alive>
    </main>

    <nav class="bottom-nav">
      <button
        style="flex: 1"
        :class="{ active: currentTab === chatStr }"
        @click="currentTab = chatStr"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            :stroke="getIconColor(chatStr)"
            stroke-width="2"
            fill="none"
            d="M2 3h16v12H5l-3 3V3z"
          />
        </svg>
        <div>聊天室</div>
      </button>

      <button
        style="flex: 1"
        :class="{ active: currentTab === contactStr }"
        @click="currentTab = contactStr"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="7"
            r="4"
            :stroke="getIconColor(contactStr)"
            stroke-width="2"
            fill="none"
          />
          <path
            d="M2 18c0-3.3137 3.134-6 7-6s7 2.6863 7 6"
            :stroke="getIconColor(contactStr)"
            stroke-width="2"
            fill="none"
          />
        </svg>
        <div>联系人</div>
      </button>

      <button
        style="flex: 1"
        :class="{ active: currentTab === selfStr }"
        @click="currentTab = selfStr"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle
            cx="10"
            cy="10"
            r="8"
            :stroke="getIconColor(selfStr)"
            stroke-width="2"
            fill="none"
          />
          <circle
            cx="10"
            cy="8"
            r="3"
            :stroke="getIconColor(selfStr)"
            stroke-width="2"
            fill="none"
          />
        </svg>
        <div>我</div>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
  height: calc(100vh - 60px - env(safe-area-inset-bottom));
}

.bottom-nav {
  height: calc(60px + env(safe-area-inset-bottom));
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #fff;
  border-top: 1px solid #eee;
  padding-bottom: env(safe-area-inset-bottom);
}

nav {
  padding-bottom: env(safe-area-inset-bottom);
}

nav button {
  background: none;
  border: none;
  font-size: 0.7rem;
  padding: 10px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888;
  transition: color 0.2s;
}

nav button.active {
  color: #42b983;
  font-weight: bold;
  background: #d0f0e0;
}

nav button svg {
  margin-bottom: 2px;
}

.floating-button {
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: #42b983;
  color: white;
  font-size: 32px;
  text-align: center;
  line-height: 50px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  cursor: grab;
  user-select: none;
}

.modal-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all; /* 保证可以拦截点击 */
}
</style>
