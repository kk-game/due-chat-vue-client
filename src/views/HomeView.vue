<script setup lang="ts">
import { ref, computed } from 'vue'
import ListView from './ListView.vue'
import ContactView from './ContactView.vue'
import SelfView from './SelfView.vue'

const currentTab = ref('chat')
const activeColor = '#42b983'
const inactiveColor = '#888'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const navBgColor = computed(() => (currentTab.value ? '#e0e0e0' : '#f8f8f8')) // 选中时加深

const getIconColor = (tab: string) => (currentTab.value === tab ? activeColor : inactiveColor)
</script>

<template>
  <div class="app-container">
    <main class="main-content">
      <component
        :is="currentTab === 'chat' ? ListView : currentTab === 'contact' ? ContactView : SelfView"
      />
    </main>

    <nav class="bottom-nav">
      <button
        style="flex: 1"
        :class="{ active: currentTab === 'chat' }"
        @click="currentTab = 'chat'"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            :stroke="getIconColor('chat')"
            stroke-width="2"
            fill="none"
            d="M2 3h16v12H5l-3 3V3z"
          />
        </svg>
        <div>聊天室</div>
      </button>
      <button
        style="flex: 1"
        :class="{ active: currentTab === 'contact' }"
        @click="currentTab = 'contact'"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="7"
            r="4"
            :stroke="getIconColor('contact')"
            stroke-width="2"
            fill="none"
          />
          <path
            d="M2 18c0-3.3137 3.134-6 7-6s7 2.6863 7 6"
            :stroke="getIconColor('contact')"
            stroke-width="2"
            fill="none"
          />
        </svg>
        <div>联系人</div>
      </button>
      <button
        style="flex: 1"
        :class="{ active: currentTab === 'self' }"
        @click="currentTab = 'self'"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            :stroke="getIconColor('self')"
            stroke-width="2"
            fill="none"
          />
          <circle
            cx="10"
            cy="8"
            r="3"
            :stroke="getIconColor('self')"
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

/* 适配圆角屏幕底部安全区 */
nav {
  padding-bottom: env(safe-area-inset-bottom);
}
nav button {
  background: none;
  border: none;
  font-size: 16px;
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
</style>
