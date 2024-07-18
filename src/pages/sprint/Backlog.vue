<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="workItems"
      v-model:expanded="expanded"
      item-key="id"
      show-expand
    >
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <th
            v-for="column in columns"
            :key="column.text"
            @click="toggleSort(column)"
            :class="[
              'column sortable',
              isSorted(column) ? 'sorted' : '',
              column.align === 'start' ? 'text-start' : '',
            ]"
          >
            <v-icon small>{{ getSortIcon(column) }}</v-icon>
            {{ column.text }}
          </th>
        </tr>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.order }}</td>
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.assign }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.type }}</td>
        </tr>
      </template>
      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">
            More info about {{ item.name }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetWorkItems } from '@/apis/workitem'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const route = useRoute()

const workItems = ref([])
const expanded = ref([])
const headers = ref([
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
  { title: '', key: 'data-table-expand' },
])


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
