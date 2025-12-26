<template>
  <v-avatar :color="uuidToColor(props.userId || '')">
    {{ (props.userName || '').substring(0, 1).toUpperCase() }}
  </v-avatar>
</template>

<script setup>
import { uuidToColor } from '@/utils/utils'

const props = defineProps(['userId', 'userName'])
</script>
