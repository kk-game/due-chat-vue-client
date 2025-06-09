<script setup lang="ts">
import { roomInfoStore } from '@/utils/app_data'
import CreateRoomView from './CreateRoomView.vue'
import VirtualList from '../components/VirtualList.vue'
import { onActivated, ref } from 'vue'
import type { SingleRoomInfo } from '@/utils/type_struct'
import emitter from '@/utils/mitt_evt'
import { EvtUpdateRoomList, RouteChat } from '@/utils/const'
import router from '@/router'

const chatRooms = ref<SingleRoomInfo[]>([])
const createRoomViewShow = ref(false)

emitter.on(EvtUpdateRoomList, () => {
  chatRooms.value = roomInfoStore().getRoomInfo() as SingleRoomInfo[]
})

onActivated(() => {
  chatRooms.value = roomInfoStore().getRoomInfo() as SingleRoomInfo[]
})

const onCreateRoom = () => {
  // createRoomViewShow.value = true
  router.replace(RouteChat)
}
</script>

<template>
  <!-- 你的模板代码：只写一次 template -->
  <div class="list-view">
    <header class="header">
      <div class="header-title">聊天室</div>
    </header>

    <div class="chat-list">
      <VirtualList :listData="chatRooms" :itemSize="140">
        <template #default="{ item: itemData }">
          <div class="chat-room" :style="{ backgroundImage: `url(${itemData.image})` }">
            <div class="overlay"></div>
            <div class="info">
              <div class="title">{{ itemData.name }}</div>
              <div class="desc">{{ itemData.desc }}</div>
              <div class="active">活跃成员: {{ itemData.online }}</div>
            </div>
          </div>
        </template>
      </VirtualList>
    </div>

    <!-- 创建房间按钮 -->
    <div class="create-room-btn">
      <button class="create-btn" @mousedown="onCreateRoom">+</button>
    </div>

    <!-- 模态创建房间 -->
    <div class="modal-mask" v-if="createRoomViewShow" @click.self="createRoomViewShow = false">
      <CreateRoomView
        class="create-room-view"
        @EvtCloseCreateRoomView="createRoomViewShow = false"
      />
    </div>
  </div>
</template>

<style scoped>
.list-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f7f7;
}

.header {
  height: 60px; /* 固定高度 */
  padding-top: env(safe-area-inset-top, 20px);
  background: #fff;
  box-shadow: 0 2px 8px #0001;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  padding: 18px 0 12px 0;
  letter-spacing: 2px;
}

.chat-list {
  margin-top: 10px; /* 与 header 的间隔 */
  height: calc(
    100vh - 60px - env(safe-area-inset-top, 20px) - 60px - env(safe-area-inset-bottom, 0px) - 20px
  );
  width: 100vw;
  overflow: auto;
}

.chat-room {
  position: relative;
  display: flex;
  align-items: center;
  height: 130px;
  width: 96vw;
  margin-left: 2vw;
  padding: 16px 24px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  color: #fff;
  box-shadow: 0 2px 8px #0003;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.chat-room:hover {
  box-shadow: 0 6px 20px #0006;
}

/* 半透明黑色遮罩，提升文字可读性 */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  pointer-events: none;
}

.info {
  position: relative; /* 保证在遮罩层之上 */
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1;
}
.title {
  font-size: 1.3rem;
  font-weight: 700;
}
.desc {
  font-size: 1rem;
}
.active {
  font-size: 0.9rem;
  color: #a6e1ff; /* 亮一点的颜色 */
}

/* +创建房间按钮 */
.create-room-btn {
  position: fixed;
  right: 30px;
  bottom: calc(env(safe-area-inset-bottom) + 130px);
  z-index: 1000;
}

.create-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: #42b983;
  color: white;
  font-size: 38px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.2s,
    transform 0.05s;
  outline: none;
  -webkit-tap-highlight-color: transparent; /* 禁用 iOS/Android 的点击高亮 */
  will-change: transform;
  user-select: none;
}

.create-btn:focus {
  outline: none;
}

.create-btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.4);
}

.create-btn:hover {
  background-color: #369b6f;
}

.create-btn:active {
  transform: scale(0.9);
}

.create-btn:focus,
.create-btn:active,
.create-btn:focus-visible {
  outline: none;
  box-shadow: none;
}

.create-btn:focus,
.create-btn:active {
  outline: none;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); /* 等效于无阴影但防止默认视觉残留 */
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); /* 半透明遮罩 */
  z-index: 2000; /* 确保在最上层 */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
