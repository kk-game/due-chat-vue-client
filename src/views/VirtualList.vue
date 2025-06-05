<template>
  <div ref="container" class="container" @scroll="handleScroll">
    <div class="placeholder" :style="{ height: listHeight + 'px' }"></div>
    <div class="list-wrapper" :style="{ transform: getTransform }">
      <div
        v-for="item in renderList"
        :key="item.id"
        class="card-item"
        :style="{ height: itemSize + 'px' }"
      >
        <slot :item="item">
          <!-- 默认渲染方式（可选） -->
          {{ item.value + 1 }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface ListItem {
  id: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // 支持更多字段
}

const props = defineProps<{
  listData: ListItem[]
  itemSize: number
}>()

const container = ref<HTMLElement | null>(null)
const containerHeight = ref(0)

const renderCount = computed(() => Math.ceil(containerHeight.value / props.itemSize) + 1)

const start = ref(0)
const offset = ref(0)

const end = computed(() => start.value + renderCount.value)

const listHeight = computed(() => props.listData.length * props.itemSize)

const renderList = computed(() =>
  props.listData.slice(start.value, Math.min(end.value, props.listData.length)),
)

const getTransform = computed(() => `translate3d(0, ${offset.value}px, 0)`)

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
}
</style>
