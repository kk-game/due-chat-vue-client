<template>
  <div ref="container" class="container" @scroll="handleScroll">
    <!-- 撑开父级容器 -->
    <div class="placeholder" :style="{ height: listHeight + 'px' }"></div>
    <!-- 实际渲染内容 -->
    <div class="list-wrapper" :style="{ transform: getTransform }">
      <div
        v-for="itemData in renderList"
        :key="getKey(itemData)"
        class="card-item"
        :style="{ height: itemSize + 'px' }"
      >
        <slot :item="itemData">
          <!-- 默认渲染 -->
          {{ getLabel(itemData) }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

/**
 * 通用组件 props
 * T 是用户传入的每项数据类型，默认为 Record<string, unknown>
 */
type ListItem = Record<string, unknown>

const props = defineProps<{
  listData: ListItem[]
  itemSize: number
  keyField?: string
  labelField?: string
}>()

const container = ref<HTMLElement | null>(null)
const containerHeight = ref(0)

// 计算可见项数
const renderCount = computed(() => Math.ceil(containerHeight.value / props.itemSize) + 1)

const start = ref(0)
const offset = ref(0)
const end = computed(() => start.value + renderCount.value)

const listHeight = computed(() => props.listData.length * props.itemSize)

const renderList = computed(() =>
  props.listData.slice(start.value, Math.min(end.value, props.listData.length)),
)

const getTransform = computed(() => `translate3d(0, ${offset.value}px, 0)`)

// 提取 key 字段函数（默认使用 "id"）
function getKey(item: ListItem): string | number {
  const keyField = props.keyField ?? 'id'
  const key = item[keyField]
  if (typeof key === 'string' || typeof key === 'number') {
    return key
  }
  console.warn(`Item is missing valid keyField: "${keyField}"`)
  return JSON.stringify(item) // fallback（不推荐用于大数据量）
}

// 提取 label 字段函数（默认使用 "value"）
function getLabel(item: ListItem): string {
  const field = props.labelField ?? 'value'
  const val = item[field]
  return typeof val === 'string' || typeof val === 'number' ? String(val) : ''
}

onMounted(() => {
  if (container.value) {
    containerHeight.value = container.value.clientHeight
  }
})

function handleScroll(e: Event) {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  start.value = Math.floor(scrollTop / props.itemSize)
  offset.value = scrollTop - (scrollTop % props.itemSize)
}
</script>

<style scoped>
.container {
  height: 100%;
  overflow: auto;
  position: relative;
}
.placeholder {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.list-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
.card-item {
  box-sizing: border-box;
  margin-bottom: 0;
}
</style>
