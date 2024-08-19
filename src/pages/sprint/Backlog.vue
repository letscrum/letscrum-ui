<template>
  <div>
    <v-data-table
      :group-by="groupBy"
      :headers="headers"
      :items="tasks"
      item-value="title"
    >
      <template #group-header="{ item, toggleGroup, isGroupOpen }">
        <tr>
          <td>
            <VBtn
              :icon="isGroupOpen(item) ? '$expand' : '$next'"
              size="small"
              variant="text"
              @click="toggleGroup(item)"
            ></VBtn>
          </td>
          <td>
            <v-btn>add</v-btn>
          </td>
          <td>
            {{ workItems.find(w => w.id === item.value).id }}
          </td>
          <td>

          </td>
          <td>
            {{ workItems.find(w => w.id === item.value).type }}
          </td>
          <td>
            <ItemDetail :item="workItems.find(w => w.id === item.value)">
              {{ workItems.find(w => w.id === item.value).title }}
            </ItemDetail>
          </td>
          <td>
            {{ workItems.find(w => w.id === item.value).status }}
          </td>
          <td>
            {{ workItems.find(w => w.id === item.value).assignUser.name == '' ? 'unassigned' : workItems.find(w => w.id === item.value).assignUser.name }}
          </td>
        </tr>
      </template>
      <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <th
            v-for="column in columns"
            :key="column.text"
            :class="[
              'column sortable',
              isSorted(column) ? 'sorted' : '',
              column.align === 'start' ? 'text-start' : '',
            ]"
            @click="toggleSort(column)"
          >
            <v-icon small>{{ getSortIcon(column) }}</v-icon>
            {{ column.text }}
          </th>
        </tr>
      </template>
      <template #item="{ item }">
        <tr v-if="item.id !== '0'">
          <td></td>
          <td></td>
          <td>{{ item.workItemId }}</td>
          <td>{{ item.id }}</td>
          <td>Task</td>
          <td><ItemDetail :item="item">
            {{ item.title }}
          </ItemDetail></td>
          <td>{{ item.status }}</td>
          <td>{{ item.assignUser.name == '' ? 'unassigned' : item.assignUser.name }}</td>
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
    text: '#',
  },
  {
    text: 'Work Item Id',
    key: 'workItemId',
  },
  {
    text: 'Task Id',
    key: 'id',
  },
  {
    text: 'Type',
    key: 'type',
  },
  {
    text: 'Title',
    key: 'title',
  },
  {
    text: 'Status',
    value: 'status',
  },
  {
    text: 'Assignee',
    value: 'assignUser.name',
  }
])

const groupBy = ref([
  {
    key: 'workItemId',
    order: 'desc',
  }])
const tasks = ref([])

function LoadWorkItems() {
  expanded.value = []
  getGetWorkItems(store.org.id, route.params.projectId, {
    sprintId: store.sprint.id,
    page: 1,
    size: -1
  }).then(res => {
    workItems.value = res.data.items
    console.log('workItems', workItems.value)
    // add all workItems tasks to tasks
    workItems.value.forEach(item => {
      if (item.tasksAll.length === 0) {
        tasks.value.push({
          workItemId: item.id,
          id: '0',
          type: '',
          title: '',
          status: '',
          assignUser: {
            name: ''
          }
        })
      } else {
        item.tasksAll.forEach(task => {
          tasks.value.push({
            workItemId: item.id,
            ...task
          })
        })
      }
    })
  })
}


onMounted(() => {
  LoadWorkItems()
})

</script>
