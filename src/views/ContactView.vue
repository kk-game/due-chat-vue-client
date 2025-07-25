<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import VirtualList from '../components/VirtualList.vue'

interface Contact {
  id: number
  name: string
  remark: string
  avatar: string
}

// 定义列表项的类型
interface ContactListItem {
  id: number
  type: 'contact'
  contact: Contact
}

// IndexedDB工具 - 简单封装
function openDB(dbName: string, storeName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function getFromDB(db: IDBDatabase, storeName: string, key: string): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    const request = store.get(key)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

async function putToDB(
  db: IDBDatabase,
  storeName: string,
  key: string,
  value: Blob,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    const request = store.put(value, key)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

function generateContacts(): Contact[] {
  const remarks = ['朋友', '同事', '客户', '大学同学', '邻居', '亲戚', '校友']
  const avatarStyles = ['adventurer', 'avataaars', 'croodles', 'fun-emoji']
  const contacts: Contact[] = []
  let idCounter = 1

  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i)
    const contactCount = Math.floor(Math.random() * 6) + 4

    for (let j = 0; j < contactCount; j++) {
      const name = `${letter}${j + 1}`
      const seed = `${letter}-${j}-${Math.random().toString(36).substring(2, 8)}`
      const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)]
      const remark = remarks[Math.floor(Math.random() * remarks.length)]

      contacts.push({
        id: idCounter++,
        name,
        remark,
        avatar: `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`,
      })
    }
  }
  return contacts.sort((a, b) => a.name.localeCompare(b.name))
}

const contacts = ref<Contact[]>(generateContacts())

const flatList = computed<ContactListItem[]>(() =>
  contacts.value.map((contact) => ({
    id: contact.id,
    type: 'contact',
    contact,
  })),
)

const DB_NAME = 'avatar-cache-db'
const STORE_NAME = 'avatars'
let db: IDBDatabase | null = null

const avatarObjectUrlMap = ref(new Map<string, string>())

async function initDB() {
  db = await openDB(DB_NAME, STORE_NAME)
}
initDB()

async function loadAvatarFromCache(url: string): Promise<string | null> {
  if (!db) return null
  try {
    const blob = await getFromDB(db, STORE_NAME, url)
    if (blob) {
      return URL.createObjectURL(blob)
    }
  } catch {
    return null
  }
  return null
}

async function cacheAvatarBlob(url: string, blob: Blob) {
  if (!db) return
  try {
    await putToDB(db, STORE_NAME, url, blob)
  } catch {
    // ignore
  }
}

async function fetchAvatarBlob(url: string): Promise<Blob> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Fetch failed')
  return res.blob()
}

async function getAvatarObjectUrl(url: string): Promise<string> {
  if (avatarObjectUrlMap.value.has(url)) {
    return avatarObjectUrlMap.value.get(url)!
  }
  const cachedUrl = await loadAvatarFromCache(url)
  if (cachedUrl) {
    avatarObjectUrlMap.value.set(url, cachedUrl)
    return cachedUrl
  }
  try {
    const blob = await fetchAvatarBlob(url)
    await cacheAvatarBlob(url, blob)
    const objectUrl = URL.createObjectURL(blob)
    avatarObjectUrlMap.value.set(url, objectUrl)
    return objectUrl
  } catch {
    return ''
  }
}

const avatarSrcMap = ref(new Map<number, string>())

async function initAvatarCache() {
  for (const contact of contacts.value) {
    const objUrl = await getAvatarObjectUrl(contact.avatar)
    avatarSrcMap.value.set(contact.id, objUrl)
  }
}

onMounted(() => {
  initAvatarCache()
})
</script>

<template>
  <div class="contact-page">
    <header class="header-title">联系人</header>

    <div class="main">
      <VirtualList :list-data="flatList" :item-size="80">
        <template #default="{ item }">
          <div class="contact-item">
            <img
              :src="avatarSrcMap.get(item.contact.id) || item.contact.avatar"
              class="avatar"
              alt="avatar"
              loading="lazy"
            />
            <div class="info">
              <div class="name">{{ item.contact.name }}</div>
              <div class="remark">{{ item.contact.remark }}</div>
            </div>
          </div>
        </template>
      </VirtualList>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 60px);
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f2f2f7;
}

.header-title {
  height: var(--safe-header-height);
  padding-top: env(safe-area-inset-top);
  line-height: var(--header-height);
  background-color: #42b983;
  color: white;
  text-align: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.main {
  height: calc(100vh - var(--layout-vertical-spacing));
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom); /* 视觉上更自然 */
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: background-color 0.2s;
  margin: 0 12px;
  margin-top: 10px;
  height: 80px;
}

.contact-item:hover {
  background-color: #f9f9fa;
}

.main :deep(.virtual-list-item):first-child .contact-item {
  margin-top: 0;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.info {
  margin-left: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.name {
  font-size: 1rem;
  font-weight: 500;
  color: #1c1c1e;
}

.remark {
  font-size: 0.75rem;
  color: #8e8e93;
}
</style>
