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
            <v-row no-gutters>
              <v-col cols="2">
                <v-btn v-if="expanded.length > 0" variant="plain" prepend-icon="mdi-arrow-expand-vertical" size="x-small" @click="collapseAll()">
                  Expand all
                </v-btn>
                <v-btn v-else variant="plain" prepend-icon="mdi-arrow-collapse-vertical" size="x-small" @click="collapseAll()">
                  Collapse all
                </v-btn>
                <div v-if="creatingWorkItem">
                  <v-row no-gutters>
                    <v-col cols="2">
                      <v-icon icon="mdi-menu-down" size="x-small" width="10%" class="float-left"></v-icon>
                      <v-sheet tile outlined class="mb-2 mr-2 float-left"
                        style="border-left-color: rgb(0, 156, 204); border-width: 1px; border-left-width: 3px;"
                        width="85%" min-width="160" height="100">
                          <input
                            ref="createWorkItemTitle" width="160"
                            class="item-card-text"
                            type="textarea"
                            @focusout="onCreatWorkItem()" @keyup.enter="onCreatWorkItem()" />
                      </v-sheet>
                    </v-col>
                    <v-col cols="10">
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="10">
                <v-row no-gutters>
                  <v-col v-for="i in ['To Do', 'In Progress', 'Done']" :key="i" cols="4">
                    {{ i }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
          <template #default="{ items, isExpanded, toggleExpand }">

            <div v-for="item in items" :key="item.raw.id">
              <v-expand-transition>
                <v-row v-if="!isExpanded(item)" no-gutters>
                  <v-col cols="2">
                    <v-icon icon="mdi-menu-down" size="x-small" width="10%" class="float-left ma-1" @click="() => toggleExpand(item)"></v-icon>
                    <VueDraggable
                      :id="item.raw.id"
                      v-model="workItems"
                      group="workItem"
                      style="width: 100%; height: 100%;"
                      @add="onMoveToSprint"
                      >
                      <WorkItemCard :work-item="item.raw" :members="sprint.members" @after-update="updateWorkItem"></WorkItemCard>
                    </VueDraggable>

                  </v-col>
                  <v-col cols="10">
                    <v-row no-gutters>
                      <v-col v-for="i in ['To Do', 'In Progress', 'Done']" :key="i" cols="4">
                        <v-row no-gutters
                        style="width: 100%; height: 80%;"
                        >
                          <v-col
                          style="width: 100%; height: 100%;"
                          >
                            <VueDraggable
                              :id="item.raw.id + '-' + i.replace(' ', '')"
                              v-model="item.raw['tasks' + i.replace(' ', '')]"
                              group="task"
                              style="width: 100%; height: 100%;"
                              @add="onAdd"
                              >
                              <div
                                v-for="task in item.raw['tasks' + i.replace(' ', '')]"
                                :key="task.id"
                              >
                                <TaskCard :task="task" :members="sprint.members" @after-update="updateTask"></TaskCard>
                              </div>
                            </VueDraggable>
                          </v-col>
                        </v-row>
                        <v-row v-if="i === 'To Do'" no-gutters>
                          <v-col>
                            <v-btn v-if="!creatingTask" variant="plain" prepend-icon="mdi-plus" size="small" class="mr-2" @click="AddTask(item.raw.id)">
                              New task
                            </v-btn>
                            <div v-show="creatingTask && item.raw.id === createTaskWorkItemId">
                              <v-sheet
tile outlined class="mb-2 mr-2 float-left"
                                style="border-left-color: rgb(242, 203, 29); border-width: 1px; border-left-width: 3px;"
                                width="185" height="100">
                                <input
                                  :id="item.raw.id + '-createTaskTitle'"
                                  ref="createTaskTitle" width="160"
                                  class="item-card-text"
                                  type="textarea"
                                  @focusout="onCreateTask()"
                                  @keyup.enter="onCreateTask()" />
                              </v-sheet>
                            </div>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row v-else no-gutters>
                  <v-col>
                    <VueDraggable
                      :id="item.raw.id + '-ToDo'"
                      v-model="item.raw['tasksToDo']"
                      group="task"
                      style="width: 100%; height: 100%;"
                      @add="onAdd"
                      >
                      <v-icon icon="mdi-menu-right" size="x-small" class="float-left" @click="() => toggleExpand(item)"></v-icon>
                      {{ item.raw.title }}
                    </VueDraggable>
                  </v-col>
                </v-row>
              </v-expand-transition>
            </div>

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
        <v-card flat tile>
          <v-card-title>
            <span class="text-h5">Sprints</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="onCloseSide">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-for="item in props.sprints"
                :key="item.id">
              <VueDraggable
                :id="item.id"
                v-model="sprintWorkItems"
                group="workItem"
                style="width: 100%; height: 100%;"
                draggable="false"
                :disabled="item.id === route.params.sprintId"
                @add="onMoveToSprint"
              >
                <v-list-item
                  lines="two"
                  :to="'/orgs/' + store.org.id + '/projects/' + item.projectId + '/sprints/' + item.id"
                  @click="onSetSprint(item.id, item.name, item.startDate, item.endDate)"
                >

                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ new Date(item.startDate * 1000).toISOString().substring(0, 10) + ' - ' + new Date(item.endDate * 1000).toISOString().substring(0, 10) }}</v-list-item-subtitle>
                  <template #append>
                    <v-chip
                      :color="item.status === 'Current' ? 'primary' : ''"
                      :variant="item.status === 'Current' ? 'flat' : 'tonal'"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>

                </v-list-item>

              </VueDraggable>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'

import { getGetWorkItems, postCreateWorkItem, putMoveWorkItem } from '@/apis/workitem';

import { postCreateTask, putMoveTask } from '@/apis/task';

import { getGetSprint } from '@/apis/sprint';

import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router';

const emit = defineEmits(['task-changed'])

const router = useRouter()

import { useAppStore } from '@/stores/app'

import { VueDraggable } from 'vue-draggable-plus'

const props = defineProps(['sprints'])

const store = useAppStore()

const route = useRoute()

const sprint = ref({})
const workItemType = ref('')
const workItems = ref([])
const creatingWorkItem = ref(false)
const creatingTask = ref(false)
const createWorkItemTitle = ref(null)
const createTaskTitle = ref(null)
const rightTaskTitle = ref(null)
const createTaskWorkItemId = ref(0)
const sprintWorkItems = ref([])

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
  })
}

function onMoveToSprint(item) {
  console.log('onMoveToSprint', item)
  console.log('to', item.to)
  console.log('tid', item.to.id)
  console.log('from', item.from)
  console.log('fid', item.from.id)
  console.log('sprints', props.sprints)
  if (props.sprints.find((sprint) => sprint.id == item.to.id) && item.from.id != item.to.id && route.params.sprintId != item.to.id) {
    putMoveWorkItem(store.org.id, route.params.projectId, item.from.id, {
      sprintId: item.to.id,
    }).then(res => {
      console.log('move res', res)
      LoadWorkItems()
    })
  } else if (item.from.id == item.to.id) {
    return
  } else {
    LoadWorkItems()
  }

}

function onSetSprint(id, name, startDate, endDate) {
  store.setSprint({
    id: id,
    name: name,
    startDate: startDate,
    endDate: endDate
  })
  LoadWorkItems()
  router.push(`/orgs/${store.org.id}/projects/${route.params.projectId}/sprints/${id}`)
}

function AddWorkItem(type) {
  creatingWorkItem.value = !creatingWorkItem.value
  console.log('createWorkItemTitle', createWorkItemTitle.value, type)
  workItemType.value = type
  setTimeout(() => {
    createWorkItemTitle.value.focus()
  }, 100);
}

function onCloseSide() {
  store.setTaskboardSidebar('')
}

function AddTask(workItemId) {
  creatingTask.value = !creatingTask.value
  console.log('createTaskTitle', createTaskTitle.value)
  createTaskWorkItemId.value = workItemId
  let id = workItemId + '-createTaskTitle'
  createTaskTitle.value.forEach(item => {
    if (item.id === id) {
      rightTaskTitle.value = item
      rightTaskTitle.value.value = ''
      setTimeout(() => {
        rightTaskTitle.value.focus()
      }, 100);
    }
  })

}

function onCreateTask() {
  if (creatingTask.value === true && rightTaskTitle.value.value && createTaskWorkItemId.value > 0) {
    postCreateTask(store.org.id, route.params.projectId, createTaskWorkItemId.value, {
      sprintId: route.params.sprintId,
      title: rightTaskTitle.value.value
    }).then(res => {
      console.log('res', res)
      // add res.data to workItems tasks which id is equal to workItemId
      for (let i = 0; i < workItems.value.length; i++) {
        if (workItems.value[i].id === createTaskWorkItemId.value) {
          workItems.value[i].tasksAll.push(res.data.item)
          workItems.value[i].tasksToDo.push(res.data.item)
        }
      }
      // reload sprint burndown
      emit('task-changed')
    })
  }
  creatingTask.value = false

}

function onCreatWorkItem() {
  if (creatingWorkItem.value === true && createWorkItemTitle.value.value) {
    postCreateWorkItem(store.org.id, route.params.projectId, {
      title: createWorkItemTitle.value.value,
      sprintId: route.params.sprintId,
      type: workItemType.value,
    }).then(res => {
      // insert res.data to allWorkItems at the beginning
      workItems.value.unshift(res.data.item)
      console.log('workItems', workItems.value)
    })
  }
  creatingWorkItem.value = false
}

function filterTasks(userId) {
  console.log('userId', userId, typeof userId)
  let myItems = []
  if (userId != "00000000-0000-0000-0000-000000000000") {
    // if allWorkItems assignUser.id or any tasks assignUser.id is equal to userId, add to myItems
    myItems = workItems.value.filter(item => {
      if (item.assignUser.id === userId.toString()) {
        return item
      }
      for (let i = 0; i < item.tasksAll.length; i++) {
        if (item.tasksAll[i].assignUser.id === userId.toString()) {
          return item
        }
      }
    })
  }
  if (userId == "all") {
    myItems = workItems.value
  }
  expanded.value = []
  // if in allWorkItems, but not in myItems, add to expanded
  workItems.value.forEach(item => {
    if (!myItems.includes(item)) {
      expanded.value.push(item.id.toString())
    }
  })
}

defineExpose({
  filterTasks,
  AddWorkItem,
  LoadWorkItems,
  showSide,
})

function showSide(type) {
  store.setTaskboardSidebar(type)
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

function onAdd(item) {
  console.log('add', item)
  console.log('to', item.to)
  console.log('id', item.to.id)
  let moveTo = item.to.id
  // split moveTo by -
  let split = moveTo.split('-')
  let workItemId = split[0]
  let status = split[1]
  let taskId = item.data.id
  putMoveTask(store.org.id, route.params.projectId, workItemId, taskId, {
    status: status,
    toWorkItemId: workItemId,
  }).then(res => {
    console.log('move res', res)
    console.log('workItems', workItems.value)
    workItems.value.find((item) => item.id == workItemId)['tasks' + status].find((task) => task.id == taskId).status = status
    workItems.value.find((item) => item.id == workItemId)['tasks' + status].find((task) => task.id == taskId).workItemId = workItemId
    emit('task-changed')
  })
}

function LoadSprint() {
  getGetSprint(store.org.id, route.params.projectId, route.params.sprintId).then(res => {
    console.log('sprint', res)
    sprint.value = res.data.item
  })
}

function updateTask(action, task) {
  console.log('updateTask', task)
  if (action == 'assign') {
    workItems.value.find((item) => item.id == task.workItemId)['tasks' + task.status].find((task) => task.id == task.id).assignUser.id = task.assignUser.id
  } else {
    let targetTask = workItems.value.find((item) => item.id == task.workItemId)['tasks' + action].find((task) => task.id == task.id)
    console.log('targetTask', targetTask)
    // remove targetTask from tasksToDo
    workItems.value.find((item) => item.id == task.workItemId)['tasks' + action].splice(workItems.value.find((item) => item.id == task.workItemId)['tasks' + action].indexOf(targetTask), 1)
    // add targetTask to tasksDone
    workItems.value.find((item) => item.id == task.workItemId)['tasks' + task.status].push(targetTask)
  }
}

function updateWorkItem(action, workItem) {
  console.log('updateWorkItem', workItem)
  if (action == 'assign') {
    workItems.value.find((item) => item.id == workItem.id).assignUser.id = workItem.assignUser.id
  } else {
    workItems.value.find((item) => item.id == workItem.id).status = workItem.status
  }
}

onMounted(() => {
  LoadSprint()
  LoadWorkItems()
  emit('task-changed')
})

</script>
