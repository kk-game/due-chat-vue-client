<script setup lang="ts">
/**
 * 这是vue3的虚拟列表组件，适用于非登高的聊天列表情况
 */
import { ref, watch, computed, nextTick, onMounted } from 'vue'

type ChatItem = Record<string, never>

const props = defineProps<{
  listData: ChatItem[]
  keyField?: string
}>()

const container = ref<HTMLElement | null>(null)
const items = ref<HTMLDivElement[]>([])

// 高度缓存和累计偏移量表
const itemHeights = ref<number[]>([])
const cumulativeHeights = ref<number[]>([])

const startIndex = ref(0)
const endIndex = ref(10)
const startOffset = ref(0)

const containerHeight = ref(0)

const visibleData = computed(() => props.listData.slice(startIndex.value, endIndex.value))

const totalHeight = computed(() => cumulativeHeights.value[cumulativeHeights.value.length - 1] || 0)

function getKey(item: ChatItem) {
  return item[props.keyField || 'id'] ?? JSON.stringify(item)
}

function updateHeights() {
  itemHeights.value = items.value.map((el) => el.offsetHeight)
  cumulativeHeights.value = []
  let sum = 0
  for (const h of itemHeights.value) {
    cumulativeHeights.value.push(sum)
    sum += h
  }
  // 追加最后的总高度
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
  const visibleCount = 15
  endIndex.value = Math.min(start + visibleCount, props.listData.length)
  startOffset.value = cumulativeHeights.value[startIndex.value] || 0
}

watch(
  () => props.listData,
  async () => {
    await nextTick()
    updateHeights()
    onScroll({ target: container.value } as Event)
  },
  { immediate: true },
)

onMounted(() => {
  containerHeight.value = container.value?.clientHeight || 0
})
</script>

<template>
  <div ref="container" class="container" @scroll="onScroll">
    <!-- 撑开总高度 -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- 实际渲染区域 -->
    <div class="list" :style="{ transform: `translateY(${startOffset}px)` }">
      <div v-for="item in visibleData" :key="getKey(item)" ref="items" class="chat-item">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.phantom {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.list {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.chat-item {
  padding: 8px 12px;
  box-sizing: border-box;
}
</style>
