<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, onMounted, computed } from 'vue'

// 泛型 props
const props = defineProps<{
  listData: T[]
  itemSize: number
  keyField?: keyof T
  labelField?: keyof T
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

function getKey(item: T): string | number {
  const keyField = props.keyField ?? ('id' as keyof T)
  const key = item[keyField]
  if (typeof key === 'string' || typeof key === 'number') {
    return key
  }
  console.warn(`Item is missing valid keyField: "${String(keyField)}"`)
  return JSON.stringify(item)
}

function getLabel(item: T): string {
  const labelField = props.labelField ?? ('value' as keyof T)
  const val = item[labelField]
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

<template>
  <div ref="container" class="container" @scroll="handleScroll">
    <div class="placeholder" :style="{ height: listHeight + 'px' }"></div>
    <div class="list-wrapper" :style="{ transform: getTransform }">
      <div
        v-for="itemData in renderList"
        :key="getKey(itemData)"
        class="card-item"
        :style="{ height: itemSize + 'px' }"
      >
        <slot :item="itemData">
          {{ getLabel(itemData) }}
        </slot>
      </div>
    </div>
  </div>
</template>

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
