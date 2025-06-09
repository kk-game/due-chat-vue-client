<script setup lang="ts">
import { RouteHome } from '@/utils/const'
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface ChatItem {
  id: number
  text: string
  from: 'me' | 'other'
}

const router = useRouter()
const chatMessages = ref<ChatItem[]>([
  { id: 1, text: '你好 👋', from: 'other' },
  { id: 2, text: '这是一条很长的消息，用于测试自动换行和高度自适应...', from: 'me' },
  { id: 3, text: 'Vue 3 很棒！', from: 'other' },
])

const newMessage = ref('')
const showTools = ref(false)

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatMessages.value.push({
      id: Date.now(),
      text: newMessage.value,
      from: 'me',
    })
    newMessage.value = ''
    nextTick(updateHeights)
  }
}

const container = ref<HTMLElement | null>(null)
const items = ref<HTMLDivElement[]>([])
const itemHeights = ref<number[]>([])
const cumulativeHeights = ref<number[]>([])
const startIndex = ref(0)
const endIndex = ref(15)
const startOffset = ref(0)

const visibleData = computed(() => chatMessages.value.slice(startIndex.value, endIndex.value))

const totalHeight = computed(() => cumulativeHeights.value[cumulativeHeights.value.length - 1] || 0)

function getKey(item: ChatItem) {
  return item.id
}

function updateHeights() {
  itemHeights.value = items.value.map((el) => el.offsetHeight)
  cumulativeHeights.value = []
  let sum = 0
  for (const h of itemHeights.value) {
    cumulativeHeights.value.push(sum)
    sum += h
  }
  cumulativeHeights.value.push(sum)
}

function binarySearch(scrollTop: number) {
  let low = 0
  let high = cumulativeHeights.value.length - 1
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (cumulativeHeights.value[mid] <= scrollTop) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return low - 1
}

function onScroll(e: Event) {
  const scrollTop = (e.target as HTMLElement).scrollTop
  const start = binarySearch(scrollTop)
  startIndex.value = Math.max(0, start)
  endIndex.value = Math.min(start + 15, chatMessages.value.length)
  startOffset.value = cumulativeHeights.value[startIndex.value] || 0
}

// 附加工具
const openEmojiPicker = () => alert('打开表情选择器')
const uploadImage = () => alert('选择图片')
const uploadFile = () => alert('上传文件')
const startVoice = () => alert('开始语音输入')
const toggleTools = () => (showTools.value = !showTools.value)

watch(
  chatMessages,
  async () => {
    await nextTick()
    updateHeights()
  },
  { immediate: true },
)

onMounted(() => {
  // container.value && (container.value.scrollTop = container.value.scrollHeight)
})

const backToHome = () => {
  router.replace(RouteHome)
}
</script>

<template>
  <div class="chat-container">
    <!-- 顶部栏 -->
    <header class="chat-header">
      <button class="back-button" @click="backToHome">←</button>
      <h2 class="chat-title">张三</h2>
    </header>

    <!-- 聊天列表 -->
    <div class="chat-body">
      <div ref="container" class="scroll-container" @scroll="onScroll">
        <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>
        <div class="list" :style="{ transform: `translateY(${startOffset}px)` }">
          <div
            v-for="item in visibleData"
            :key="getKey(item)"
            ref="items"
            class="chat-item"
            :class="{ mine: item.from === 'me' }"
          >
            <div class="bubble">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 附加工具选择窗口 -->
    <div v-if="showTools" class="tool-panel">
      <button @click="uploadImage">📷 图片</button>
      <button @click="uploadFile">📎 文件</button>
      <button @click="startVoice">🎤 语音</button>
      <button @click="openEmojiPicker">😊 表情</button>
    </div>

    <!-- 底部输入框 -->
    <footer class="chat-footer">
      <button class="tools-button" @click="toggleTools">➕</button>
      <input
        v-model="newMessage"
        type="text"
        class="chat-input"
        placeholder="请输入消息..."
        @keyup.enter="sendMessage"
      />
      <button class="send-button" @click="sendMessage" aria-label="发送">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </footer>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
}
.chat-header {
  height: 60px;
  background-color: #42b983;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: white;
  font-size: 20px;
  font-weight: bold;
}
.back-button {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  color: white;
  font-size: 22px;
  cursor: pointer;
}
.chat-title {
  margin: 0;
}
.chat-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.scroll-container {
  height: 100%;
  overflow-y: auto;
  position: relative;
}
.phantom {
  position: absolute;
  width: 100%;
}
.list {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
.chat-item {
  padding: 8px 16px;
  display: flex;
  justify-content: flex-start;
}
.chat-item.mine {
  justify-content: flex-end;
}
.bubble {
  background-color: #f1f1f1;
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 60%;
  word-break: break-word;
  white-space: pre-wrap;
}
.chat-footer {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-top: 1px solid #ddd;
  background: white;
}
.chat-input {
  flex: 1;
  height: 36px;
  border: 1px solid #ccc;
  border-radius: 18px;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
}
.send-button,
.tools-button {
  margin-left: 8px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
}
.tool-panel {
  display: flex;
  justify-content: space-around;
  background: #f9f9f9;
  border-top: 1px solid #ddd;
  padding: 8px 0;
}
.tool-panel button {
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
}
.send-button svg {
  color: #42b983;
}
</style>
