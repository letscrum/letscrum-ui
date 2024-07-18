<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="workItems"
      :expanded="expanded"
      item-key="id"
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info about {{ item.name }}
        </td>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>

import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetWorkItems } from '@/apis/workitem'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const route = useRoute()

const workItems = ref([])
const expanded = ref([])
const headers = [
  {
    text: 'Order',
    align: 'start',
    sortable: false,
    value: 'order',
  },
  { text: 'ID', value: 'id' },
  { text: 'Title', value: 'title' },
  { text: 'Assign', value: 'assign' },
  { text: 'Status', value: 'status' },
  { text: 'Type', value: 'type' },
]


function LoadWorkItems() {
  expanded.value = []
  getGetWorkItems(route.params.projectId, {
    sprintId: store.sprint.id,
    page: 1,
    size: -1
  }).then(res => {
    workItems.value = res.data.items
    console.log('workItems', workItems.value)
  })
}


onMounted(() => {
  LoadWorkItems()
})

</script>
