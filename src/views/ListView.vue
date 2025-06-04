<script setup lang="ts">
import { ref } from 'vue'

interface ChatRoom {
  id: number
  title: string
  desc: string
  bg: string
  active: number
}

const chatRooms = ref<ChatRoom[]>([
  {
    id: 1,
    title: 'Vue3 技术交流群',
    desc: '讨论 Vue3 相关技术与实践',
    bg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    active: 128,
  },
  {
    id: 2,
    title: '前端摸鱼乐园',
    desc: '摸鱼、分享、快乐前端',
    bg: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    active: 56,
  },
  {
    id: 3,
    title: 'AI 聊天室',
    desc: 'AI 相关话题畅聊',
    bg: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    active: 203,
  },
  {
    id: 4,
    title: 'React 技术交流',
    desc: 'React 框架深度探讨',
    bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
    active: 150,
  },
  {
    id: 5,
    title: 'Node.js 开发组',
    desc: 'Node.js 相关技术分享',
    bg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    active: 97,
  },
  {
    id: 6,
    title: '前端面试经验',
    desc: '分享前端面试技巧',
    bg: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=400&q=80',
    active: 83,
  },
  {
    id: 7,
    title: '设计模式学习',
    desc: '讨论设计模式与应用',
    bg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    active: 45,
  },
  {
    id: 8,
    title: 'JavaScript 深入',
    desc: '探讨 JS 核心原理',
    bg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    active: 174,
  },
  {
    id: 9,
    title: 'CSS 动画爱好者',
    desc: '分享酷炫动画效果',
    bg: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    active: 38,
  },
  {
    id: 10,
    title: '全栈开发交流群',
    desc: '前后端全栈技术交流',
    bg: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    active: 120,
  },
  {
    id: 11,
    title: 'TypeScript 进阶',
    desc: '深入理解 TS',
    bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
    active: 66,
  },
  {
    id: 12,
    title: 'Web 性能优化',
    desc: '提升网站加载速度',
    bg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    active: 89,
  },
  {
    id: 13,
    title: '人工智能小组',
    desc: 'AI 相关技术探讨',
    bg: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=400&q=80',
    active: 230,
  },
  {
    id: 14,
    title: '产品经理交流群',
    desc: '产品设计与需求讨论',
    bg: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    active: 54,
  },
  {
    id: 15,
    title: '移动端开发',
    desc: 'iOS & Android 技术分享',
    bg: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    active: 88,
  },
  {
    id: 16,
    title: '开源项目合作',
    desc: '协同开发与贡献',
    bg: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    active: 77,
  },
  {
    id: 17,
    title: '算法刷题训练营',
    desc: '刷题与算法讨论',
    bg: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    active: 104,
  },
  {
    id: 18,
    title: '区块链技术圈',
    desc: '区块链技术与应用',
    bg: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
    active: 61,
  },
  {
    id: 19,
    title: '云计算讨论区',
    desc: '云服务与架构探讨',
    bg: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80',
    active: 93,
  },
  {
    id: 20,
    title: '大数据分析',
    desc: '数据挖掘与分析技术',
    bg: 'https://images.unsplash.com/photo-1496317899792-9d7dbcd928a1?auto=format&fit=crop&w=400&q=80',
    active: 79,
  },
])
</script>

<template>
  <div class="list-view">
    <header class="header">
      <div class="header-title">聊天室</div>
    </header>
    <div class="chat-list">
      <div
        v-for="room in chatRooms"
        :key="room.id"
        class="chat-room"
        :style="{ backgroundImage: `url(${room.bg})` }"
      >
        <div class="overlay"></div>
        <div class="info">
          <div class="title">{{ room.title }}</div>
          <div class="desc">{{ room.desc }}</div>
          <div class="active">活跃人数：{{ room.active }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-view {
  display: block;
  flex-direction: column;
  height: 100vh;
  background: #f7f7f7;
}
.header {
  padding-top: env(safe-area-inset-top, 20px);
  background: #fff;
  box-shadow: 0 2px 8px #0001;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-title {
  font-size: 1.6rem;
  font-weight: bold;
  text-align: center;
  padding: 18px 0 12px 0;
  letter-spacing: 2px;
}
.chat-list {
  /* flex: 1; */
  /* overflow-y: auto; */
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.chat-room {
  position: relative;
  display: flex;
  align-items: center;
  height: 120px;
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
</style>
