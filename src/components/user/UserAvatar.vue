<template>
  <v-avatar
    :color="uuidToColor(props.userId || '')"
    :size="props.size"
    rounded="circle"
    class="ado-user-avatar"
  >
    <span :style="`font-size: ${fontSize}px; font-weight: 600; color: white;`">
      {{ (props.userName || '?').substring(0, 1).toUpperCase() }}
    </span>
  </v-avatar>
</template>

<script setup>
import { computed } from 'vue'
import { uuidToColor } from '@/utils/utils'

const props = defineProps({
  userId: { type: [String, Number], default: '' },
  userName: { type: String, default: '' },
  size: { type: [String, Number], default: 32 }
})

const fontSize = computed(() => {
  const s = Number(props.size) || 32
  return Math.max(10, Math.round(s * 0.42))
})
</script>
