<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-data-iterator
          :items="workItems"
          hide-default-footer
          v-model:expanded="expanded"
          items-per-page="-1"
        >
          <template v-slot:header>
            <v-row no-gutters>
              <v-col cols="2">
                <v-btn variant="plain" prepend-icon="mdi-arrow-expand-vertical" size="x-small" @click="collapseAll()" v-if="expanded.length > 0">
                  Expand all
                </v-btn>
                <v-btn variant="plain" prepend-icon="mdi-arrow-collapse-vertical" size="x-small" @click="collapseAll()" v-else>
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
                          @focusout="onCreatWorkItem()"
                          @keyup.enter="onCreatWorkItem()"
                          style="border-width: 1px; border-style: solid; border-color: gray; margin: 2px 2px 2px 2px;" type="textarea" />
                      </v-sheet>
                    </v-col>
                    <v-col cols="10">
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="10">
                <v-row no-gutters>
                  <v-col cols="4" v-for="i in ['To Do', 'In Progress', 'Done']" :key="i">
                    {{ i }}
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
          <template v-slot:default="{ items, isExpanded, toggleExpand }">
            <div v-for="item in items" :key="item.raw.id">
              <v-expand-transition>
                <v-row no-gutters v-if="!isExpanded(item)">
                  <v-col cols="2">
                    <v-icon icon="mdi-menu-down" size="x-small" width="10%" class="float-left ma-1" @click="() => toggleExpand(item)"></v-icon>
                    <WorkItemCard :workItem="item.raw" :members="sprint.members"></WorkItemCard>
                  </v-col>
                  <v-col cols="10">
                    <v-row no-gutters>
                      <v-col cols="4" v-for="i in ['To Do', 'In Progress', 'Done']" :key="i">
                        <v-row no-gutters
                        style="background-color: aquamarine; width: 100%; height: 80%;"
                        >
                          <v-col
                          style="background-color: aquamarine; width: 100%; height: 100%;"
                          >
                            <VueDraggable
                              @add="onAdd"
                              v-model="item.raw['tasks' + i.replace(' ', '')]"
                              group="task"
                              :id="item.raw.id + '-' + i.replace(' ', '')"
                              style="background-color: aquamarine; width: 100%; height: 100%;"
                              >
                              <div
                                v-for="task in item.raw['tasks' + i.replace(' ', '')]"
                                :key="task.id"
                              >
                                <TaskCard :task="task" :members="sprint.members" :status="task.status" @afterUpdate="updateTask"></TaskCard>
                              </div>
                            </VueDraggable>
                          </v-col>
                        </v-row>
                        <v-row no-gutters v-if="i === 'To Do'">
                          <v-col>
                            <v-btn variant="plain" prepend-icon="mdi-plus" size="small" class="mr-2" @click="AddTask(item.raw.id)" v-if="!creatingTask">
                              New task
                            </v-btn>
                            <div v-show="creatingTask && item.raw.id === createTaskWorkItemId">
                              <v-sheet tile outlined class="mb-2 mr-2 float-left"
                                style="border-left-color: rgb(242, 203, 29); border-width: 1px; border-left-width: 3px;"
                                width="185" height="100">
                                <input
                                    :id="item.raw.id + '-createTaskTitle'"
                                    ref="createTaskTitle" width="160"
                                    @focusout="onCreateTask()"
                                    @keyup.enter="onCreateTask()"
                                    style="border-width: 1px; border-style: solid; border-color: gray; margin: 2px 2px 2px 2px;" type="textarea" />
                              </v-sheet>
                            </div>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row no-gutters v-else>
                  <v-col>
                    <VueDraggable
                      @add="onAdd"
                      v-model="item.raw['tasksToDo']"
                      group="task"
                      :id="item.raw.id + '-ToDo'"
                      style="background-color: aquamarine; width: 100%; height: 100%;"
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
      <v-col v-if="workDetail" cols="3">
        <v-card flat tile>
          <v-card-title>
            <span class="text-h5">Work Details</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" @click="workDetail = false">
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
    </v-row>
  </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'

import { getGetWorkItems, postCreateWorkItem } from '@/apis/workitem';

import { postCreateTask, putMoveTask } from '@/apis/task';

import { getGetSprint } from '@/apis/sprint';

import { useRoute } from 'vue-router'

import { useAppStore } from '@/stores/app'

import { VueDraggable } from 'vue-draggable-plus'

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

const workDetail = ref(false)
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

function onDrop(event) {
  console.log('onDrop', event)
}

function AddWorkItem(type) {
  creatingWorkItem.value = !creatingWorkItem.value
  console.log('createWorkItemTitle', createWorkItemTitle.value, type)
  workItemType.value = type
  setTimeout(() => {
    createWorkItemTitle.value.focus()
  }, 100);
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
  if (userId > 0) {
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
  if (userId === -1) {
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
  LoadWorkItems
})

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

function onUpdate(item) {
  console.log('update', item)
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
  })
}
function remove(item) {
  console.log('remove', item)
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

onMounted(() => {
  LoadSprint()
  LoadWorkItems()
})

</script>
