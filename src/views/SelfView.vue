<script setup lang="ts">
const user = {
  avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=A-4-3se6uk', // 可替换为真实头像
  nickname: '张三',
  account: 'zhangsan@example.com',
  password: '********',
  version: 'v1.0.0',
}
</script>

<template>
  <div class="profile-wrapper">
    <div class="profile-header">
      <img class="avatar" :src="user.avatar" alt="用户头像" />
      <h2 class="nickname">{{ user.nickname }}</h2>
    </div>

    <div class="profile-info">
      <div class="info-card">
        <label>账号</label>
        <div>{{ user.account }}</div>
      </div>
      <div class="info-card">
        <label>密码</label>
        <div>{{ user.password }}</div>
      </div>
      <div class="info-card">
        <label>软件版本</label>
        <div>{{ user.version }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-wrapper {
  height: calc(100vh - 60px - env(safe-area-inset-bottom));
  padding: 32px 16px env(safe-area-inset-bottom);
  background-color: #f2f4f7;
  overflow-y: auto;
  box-sizing: border-box;
  margin-top: calc(env(safe-area-inset-top));
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.nickname {
  margin-top: 16px;
  font-size: 22px;
  font-weight: 600;
  color: #333;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background-color: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  font-size: 16px;
  color: #444;
}

.info-card label {
  font-size: 14px;
  color: #888;
  display: block;
  margin-bottom: 4px;
}
</style>
