<template>
  <v-avatar :color="uuidToColor(userId)">
    {{ userName.substring(0, 1) }}
  </v-avatar>
</template>

<script setup>
import { uuidToColor } from '@/utils/utils'

const props = defineProps(['userId', 'userName'])

const userId = ref(props.userId)
const userName = ref(props.userName)

</script>
