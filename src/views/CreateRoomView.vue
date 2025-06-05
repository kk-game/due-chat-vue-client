<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['close'])

const title = ref('')
const desc = ref('')
const bgUrl = ref('')

const onSubmit = () => {
  // TODO: 实现创建聊天室逻辑，例如发送到后端
  console.log('创建聊天室:', { title: title.value, desc: desc.value, bgUrl: bgUrl.value })

  // 自动关闭模态弹窗
  emit('close')
  // 可选：跳转回首页或其他页面
  // router.push('/')
}

const onClose = () => {
  emit('close')
}
</script>

<template>
  <div class="create-room">
    <header class="modal-header">
      <h2>创建聊天室</h2>
      <button class="close-btn" @click="onClose">×</button>
    </header>

    <form class="room-form" @submit.prevent="onSubmit">
      <div class="form-item">
        <label>聊天室名称</label>
        <input v-model="title" type="text" placeholder="给聊天室起个名字" required />
      </div>

      <div class="form-item">
        <label>聊天室简介</label>
        <textarea v-model="desc" placeholder="简单介绍一下聊天室" required></textarea>
      </div>

      <div class="form-item">
        <label>背景图片</label>
        <input v-model="bgUrl" type="text" placeholder="输入背景图片 URL" required />
      </div>

      <button type="submit" class="submit-btn">创建</button>
    </form>
  </div>
</template>

<style scoped>
.create-room {
  width: 90vw;
  max-width: 400px;
  max-height: 90vh;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: env(safe-area-inset-top) 1rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  background-color: #f8f8f8;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.close-btn {
  border: none;
  background: none;
  font-size: 1.5rem;
  color: #666;
  padding: 0.5rem;
  cursor: pointer;
}

.room-form {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-item label {
  font-size: 0.9rem;
  color: #666;
}

.form-item input,
.form-item textarea {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
}

.form-item textarea {
  height: 6rem;
  resize: none;
}

.submit-btn {
  margin-top: auto;
  padding: 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #369d6c;
}
</style>
