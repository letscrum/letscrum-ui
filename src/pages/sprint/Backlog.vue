<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-data-iterator
          v-model:expanded="expanded"
          :items="workItems"
          hide-default-footer
          items-per-page="-1"
        >
          <template #header>
            <v-row no-gutters class="text-caption font-weight-bold text-grey-darken-1 py-2 border-b bg-white">
              <v-col cols="1" class="d-flex align-center justify-center">
                <v-btn v-if="expanded.length > 0" variant="text" density="compact" icon="mdi-unfold-less-horizontal" size="small" title="Collapse All" @click="collapseAll()"></v-btn>
                <v-btn v-else variant="text" density="compact" icon="mdi-unfold-more-horizontal" size="small" title="Expand All" @click="collapseAll()"></v-btn>
                <span class="ml-1">Order</span>
              </v-col>
              <v-col cols="6" class="pl-2">Title</v-col>
              <v-col cols="2">State</v-col>
              <v-col cols="2">Assigned To</v-col>
              <v-col cols="1">Rem...</v-col>
            </v-row>
          </template>
          <template #default="{ items, isExpanded, toggleExpand }">
            <VueDraggable
              v-model="workItems"
              :animation="150"
              group="workItem"
              handle=".handleWorkItem"
              @update="onReOrderWorkItems"
            >
            <div v-for="(item, index) in items" :id="item.raw.id" :key="item.raw.id">
              <v-hover v-slot="{ isHovering, props: hoverProps }">
                <v-row
                  v-bind="hoverProps"
                  no-gutters
                  class="handleWorkItem py-1 border-b align-center"
                  :class="{'bg-grey-lighten-4': isHovering}"
                  style="cursor: pointer; transition: background-color 0.2s;"
                >
                  <v-col cols="1" class="d-flex align-center justify-center text-grey position-relative">
                    <div class="position-absolute" style="left: 10px; top: 40%; transform: translateY(-50%);">
                      <TaskCreate :work-item-id="item.raw.id" @after-create="onCreateTask">
                        <v-hover v-slot="{ isHovering: isBtnHovering, props: btnProps }">
                          <v-btn
                            v-bind="btnProps"
                            :style="{ visibility: isHovering ? 'visible' : 'hidden' }"
                            variant="text"
                            density="compact"
                            icon
                            size="small"
                            :color="isBtnHovering ? 'success' : undefined"
                          >
                              <v-icon icon="mdi-plus"></v-icon>
                          </v-btn>
                        </v-hover>
                      </TaskCreate>
                    </div>
                    <v-btn
                      variant="text"
                      density="compact"
                      icon
                      size="small"
                      @click.stop="toggleExpand(item)"
                    >
                      <v-icon :icon="isExpanded(item) ? 'mdi-chevron-down' : 'mdi-chevron-right'"></v-icon>
                    </v-btn>
                    <span class="ml-1 text-caption">{{ index + 1 }}</span>
                  </v-col>
                  <v-col cols="6" class="d-flex align-center pl-2">
                    <v-icon :color="item.raw.type === 'Bug' ? 'red' : 'blue'" size="small" class="mr-2">
                      {{ item.raw.type === 'Bug' ? 'mdi-bug' : 'mdi-clipboard-text' }}
                    </v-icon>
                    <div class="text-body-2 text-truncate" style="max-width: 90%;">
                      <ItemDetail item-type="WORKITEM" :item-id="item.raw.id">
                        {{ item.raw.title }}
                      </ItemDetail>
                    </div>
                  </v-col>
                  <v-col cols="2" class="d-flex align-center">
                    <v-icon size="x-small" :color="item.raw.status === 'Done' ? 'success' : (item.raw.status === 'In Progress' ? 'info' : 'grey')" class="mr-2">mdi-circle</v-icon>
                    <span class="text-caption">{{ item.raw.status }}</span>
                  </v-col>
                  <v-col cols="2">
                    <span class="text-caption">{{ item.raw.assignUser?.name }}</span>
                  </v-col>
                  <v-col cols="1">
                  </v-col>
                </v-row>
              </v-hover>

              <v-expand-transition>
                <div v-if="isExpanded(item)">
                  <VueDraggable
                    :id="item.raw.id"
                    v-model="item.raw.tasksAll"
                    group="tasks"
                    @update="onReOrderTasks"
                    @add="onAdd"
                    @remove="remove"
                    >
                    <div v-for="task in item.raw.tasksAll" :key="task.id">
                      <v-hover v-slot="{ isHovering: isTaskHovering, props: taskProps }">
                        <v-row
                          v-bind="taskProps"
                          no-gutters
                          class="py-1 border-b align-center"
                          :class="{'bg-grey-lighten-5': !isTaskHovering, 'bg-grey-lighten-4': isTaskHovering}"
                        >
                          <v-col cols="1">
                          </v-col>
                          <v-col cols="6" class="d-flex align-center pl-8">
                            <v-icon color="#F2CB1D" size="small" class="mr-2">mdi-checkbox-marked-circle-outline</v-icon>
                            <div class="text-body-2 text-truncate">
                              <ItemDetail item-type="TASK" :item-id="task.id">
                                {{ task.title }}
                              </ItemDetail>
                            </div>
                          </v-col>
                          <v-col cols="2" class="d-flex align-center">
                            <v-icon size="x-small" :color="task.status === 'Done' ? 'success' : (task.status === 'In Progress' ? 'info' : 'grey')" class="mr-2">mdi-circle</v-icon>
                            <span class="text-caption">{{ task.status }}</span>
                          </v-col>
                          <v-col cols="2">
                            <span class="text-caption">{{ task.assignUser?.name }}</span>
                          </v-col>
                          <v-col cols="1">
                            <span class="text-caption">{{ task.remainingWork }}</span>
                          </v-col>
                        </v-row>
                      </v-hover>
                    </div>
                  </VueDraggable>
                </div>
              </v-expand-transition>
            </div>
          </VueDraggable>
          </template>
        </v-data-iterator>
      </v-col>
      <v-divider vertical />
      <v-col v-if="store.sprint.showDetails" cols="3">
        <v-card flat tile>
          <v-card-title>
            <span class="text-h5">Work Details</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="onCloseSide">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            123<br/>
            123<br/>
            123<br/>
            123
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="store.sprint.showSprints" cols="3">
        <SprintsSider :sprints="props.sprints" @after-move="onCreateTask" @close-side="onCloseSide"></SprintsSider>
      </v-col>
    </v-row>
  </div>
</template>
<script setup>

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getGetSprintWorkItems, getGetProjectWorkItems, putReOrderWorkItems } from '@/apis/workitem'
import { putReOrderTasks } from '@/apis/task'
import { useAppStore } from '@/stores/app'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['task-changed'])

const props = defineProps(['sprints'])

const store = useAppStore()

const route = useRoute()

const workItems = ref([])
const expanded = ref([])

function LoadWorkItems() {
  if (route.name == 'ProductBacklog') {
    getGetProjectWorkItems(store.org.id, route.params.projectId, {
      page: 1,
      size: -1
    }).then(res => {
      workItems.value = res.data.items
      console.log('workItems', workItems.value)
      workItems.value.forEach(item => {
        expanded.value.push(item.id.toString())
      })
    })
  } else {
    getGetSprintWorkItems(store.org.id, route.params.projectId, store.sprint.id, {
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


defineExpose({
  showSide,
  LoadWorkItems,
})

function showSide(type) {
  store.setSidebar(type)
}

onMounted(() => {
  LoadWorkItems()
  emit('task-changed')
})

function onAdd(event) {
  console.log('add', event)
}
function remove(event) {
  console.log('remove', event)
}
function onReOrderWorkItems(event) {
  console.log('reorder', event)
  console.log('workItems', workItems.value.map(item => item.id))
  putReOrderWorkItems(
    route.params.orgId, route.params.projectId, {
    workItemIds: workItems.value.map(item => item.id)
  }).then(res => {
    console.log('reorder', res)
  })
}

function onReOrderTasks(event) {
  console.log('reorder', event)
  console.log('from', event.from.id)
  putReOrderTasks(
    route.params.orgId, route.params.projectId, event.from.id, {
    taskIds: workItems.value.find(item => item.id == event.from.id).tasksAll.map(task => task.id)
  }).then(res => {
    console.log('reorder', res)
  })
}

function onCreateTask() {
  LoadWorkItems()
  emit('task-changed')
}


function onCloseSide() {
  store.setSidebar('')
}

</script>
