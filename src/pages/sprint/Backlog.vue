<template>
  <div>
    <v-data-iterator
      v-model:expanded="expanded"
      :items="workItems"
      hide-default-footer
      items-per-page="-1"
    >
      <template #header>
        <v-row no-gutters>
          <v-col cols="2" style="background-color: aqua;">
            <v-btn v-if="expanded.length > 0" variant="plain" prepend-icon="mdi-arrow-expand-vertical" size="x-small" @click="collapseAll()">
              Expand all
            </v-btn>
            <v-btn v-else variant="plain" prepend-icon="mdi-arrow-collapse-vertical" size="x-small" @click="collapseAll()">
              Collapse all
            </v-btn>
          </v-col>
          <v-col cols="10" style="background-color: aquamarine">
            wi details
          </v-col>
        </v-row>
      </template>
      <template #default="{ items, isExpanded, toggleExpand }">
        <VueDraggable
          v-model="workItems"
          :animation="150"
          handle=".handleWorkItem"
        >
        <div v-for="item in items" :key="item.raw.id">
            <v-row no-gutters class="handleWorkItem" style="background-color: bisque">
              <v-col cols="2">
                <v-icon :icon="!isExpanded(item) ? 'mdi-menu-down' : 'mdi-menu-right'" size="x-small" width="10%" class="float-left ma-1" @click="() => toggleExpand(item)"></v-icon>
              </v-col>
              <v-col cols="10">
                {{ item.raw.title }}
              </v-col>
            </v-row>
          <v-expand-transition>
            <VueDraggable
                    v-model="item.raw.tasksAll"
                    group="tasks"
                    @update="onUpdate"
                    @add="onAdd"
                    @remove="remove"
                    >
            <v-row v-if="!isExpanded(item)" no-gutters>
              <v-col cols="12">
                <VueDraggable
                    v-model="item.raw.tasksAll"
                    group="tasks"
                    @update="onUpdate"
                    @add="onAdd"
                    @remove="remove"
                    >
                <div v-for="task in item.raw.tasksAll" :key="task.id">

                    <v-row no-gutters style="background-color:brown">
                      <v-col cols="2">

                      </v-col>
                      <v-col cols="6">
                        {{ task.title }}
                      </v-col>
                      <v-col cols="4">
                        {{ task.status }}
                      </v-col>
                    </v-row>
                </div>
              </VueDraggable>
              </v-col>
            </v-row>
          </VueDraggable>

          </v-expand-transition>
        </div>
      </VueDraggable>
      </template>
    </v-data-iterator>
  </div>
</template>
<script setup>

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetWorkItems } from '@/apis/workitem'
import { useAppStore } from '@/stores/app'
import { VueDraggable } from 'vue-draggable-plus'

const store = useAppStore()

const route = useRoute()

const workItems = ref([])
const expanded = ref([])

function LoadWorkItems() {
  expanded.value = []
  getGetWorkItems(store.org.id, route.params.projectId, {
    sprintId: store.sprint.id,
    page: 1,
    size: -1
  }).then(res => {
    workItems.value = res.data.items
    console.log('workItems', workItems.value)
    workItems.value.forEach(item => {
      expanded.value.push(item.id.toString())
    })
  })
}


function collapseAll() {
  console.log('workItems', workItems.value)
  if (expanded.value.length > 0) {
    expanded.value = []
  } else {
    expanded.value = []
    workItems.value.forEach(item => {
      expanded.value.push(item.id.toString())
    })
  }
  console.log('expanded', expanded.value)
}

onMounted(() => {
  LoadWorkItems()
})

function onMoveWorkItem(event) {
  console.log('onMoveWorkItem', event)
}

function onUpdate() {
  console.log('update')
}
function onAdd(event) {
  console.log('add', event)
}
function remove(event) {
  console.log('remove', event)
}

</script>
