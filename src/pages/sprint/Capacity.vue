<template>
  <div>
    <v-data-table
      :items="members"
    >
    </v-data-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetSprint } from '@/apis/sprint'


const route = useRoute()
const sprint = ref({})
const members = ref([])
const headers = ref([
  { text: 'Order', value: 'order' },
  { text: 'ID', value: 'id' },
  { text: 'Title', value: 'title' },
  { text: 'Assign', value: 'assign' },
  { text: 'Status', value: 'status' },
])

function LoadSprint() {
  getGetSprint(route.params.orgId, route.params.projectId, route.params.sprintId).then((res) => {
    if (res.status === 200) {
      sprint.value = res.data.item
      members.value = res.data.item.members
    }
  })
}

onMounted(() => {
  LoadSprint()
})
</script>
