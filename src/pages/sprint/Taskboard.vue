<template>
  <div class="h-100" style="overflow-x: auto;">
    <v-data-iterator
      v-model:expanded="expanded"
      :items="workItems"
      hide-default-footer
      items-per-page="-1"
      class="h-100"
    >
      <template #header>
        <v-row no-gutters class="flex-nowrap mt-1">
          <v-col cols="auto" style="width: 200px; min-width: 200px; max-width: 200px;">
            <div class="d-flex align-center justify-space-between mb-1" style="height: 28px;">
              <v-btn
                v-if="expanded.length > 0"
                variant="text"
                prepend-icon="mdi-arrow-expand-vertical"
                size="small"
                @click="collapseAll()"
              >
                Expand all
              </v-btn>
              <v-btn
                v-else
                variant="text"
                prepend-icon="mdi-arrow-collapse-vertical"
                size="small"
                @click="collapseAll()"
              >
                Collapse all
              </v-btn>
            </div>

            <!-- Create Work Item Input -->
            <v-expand-transition>
              <div v-if="creatingWorkItem">
                <v-card
                  elevation="2"
                  class="pa-2"
                  :style="`border-left: 4px solid ${workItemType == 'Backlog' ? '#009CCC' : '#CC293D'};`"
                >
                  <v-textarea
                    ref="createWorkItemTitle"
                    rows="2"
                    auto-grow
                    variant="plain"
                    hide-details
                    placeholder="Enter title..."
                    class="text-body-2"
                    @focusout="onCreatWorkItem()"
                    @keydown.enter.prevent="onCreatWorkItem()"
                  ></v-textarea>
                </v-card>
              </div>
            </v-expand-transition>
          </v-col>

          <v-col class="flex-grow-1" style="min-width: 600px;">
            <v-row no-gutters>
              <v-col v-for="header in ['To Do', 'In Progress', 'Done']" :key="header" cols="4" class="px-1" style="min-width: 200px;">
                <div class="d-flex align-center pl-1 mb-1" style="height: 28px;">
                  <div class="text-subtitle-2 font-weight-bold text-medium-emphasis mr-2">
                    {{ header }}
                  </div>
                  <v-chip size="x-small" density="comfortable" variant="tonal" color="grey-darken-1" class="font-weight-bold">
                    {{ getTaskCount(header) }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>

      <template #default="{ items, isExpanded, toggleExpand }">
        <div v-for="item in items" :key="item.raw.id" class="mb-1">
          <v-expand-transition>
            <!-- Expanded View -->
            <v-row v-if="!isExpanded(item)" no-gutters class="py-0 flex-nowrap">
              <!-- Work Item Column -->
              <v-col cols="auto" class="px-1 d-flex align-start" style="width: 200px; min-width: 200px; max-width: 200px;">
                <v-btn
                  icon="mdi-chevron-down"
                  variant="text"
                  size="x-small"
                  density="compact"
                  class="mt-1 mr-1"
                  @click="() => toggleExpand(item)"
                ></v-btn>

                <div class="flex-grow-1">
                  <VueDraggable
                    :id="item.raw.id"
                    v-model="workItems"
                    group="workItem"
                    :animation="150"
                  >
                    <div :id="item.raw.id">
                      <WorkItemCard
                        :work-item="item.raw"
                        :members="sprint.members"
                        @after-update="updateWorkItem"
                        @add-task="AddTask(item.raw.id)"
                      />
                    </div>
                  </VueDraggable>
                </div>
              </v-col>

              <!-- Task Columns -->
              <v-col class="flex-grow-1" style="min-width: 600px;">
                <v-row no-gutters class="h-100">
                  <v-col v-for="status in ['To Do', 'In Progress', 'Done']" :key="status" cols="4" class="pl-1 h-100" style="min-width: 200px;">
                    <v-sheet
                      color="grey-lighten-4"
                      class="d-flex flex-column fill-height rounded-0 pa-0"
                      min-height="100"
                    >
                      <VueDraggable
                        :id="item.raw.id + '-' + status.replace(' ', '')"
                        v-model="item.raw['tasks' + status.replace(' ', '')]"
                        group="task"
                        class="flex-grow-1 d-flex flex-wrap align-content-start"
                        :animation="150"
                        @add="onAdd"
                      >
                        <div
                          v-for="task in item.raw['tasks' + status.replace(' ', '')]"
                          :key="task.id"
                        >
                          <TaskCard
                            :task="task"
                            :members="sprint.members"
                            @after-update="updateTask"
                          />
                        </div>
                      </VueDraggable>

                      <!-- Create Task Input (Only in To Do) -->
                      <div v-if="status === 'To Do'" class="mt-2 px-1">
                        <v-expand-transition>
                          <div v-if="creatingTask && item.raw.id === createTaskWorkItemId">
                            <v-card
                              elevation="2"
                              class="pa-2"
                              style="border-left: 4px solid #F2CB1D;"
                            >
                              <v-textarea
                                :id="item.raw.id + '-createTaskTitle'"
                                ref="createTaskTitle"
                                rows="2"
                                auto-grow
                                variant="plain"
                                hide-details
                                placeholder="Enter title..."
                                class="text-body-2"
                                @focusout="onCreateTask()"
                                @keydown.enter.prevent="onCreateTask()"
                              ></v-textarea>
                            </v-card>
                          </div>
                          <div v-else class="pa-1 mb-1">
                            <div
                              v-if="!item.raw['tasksToDo'] || item.raw['tasksToDo'].length === 0"
                              class="d-flex align-center cursor-pointer"
                              @click="AddTask(item.raw.id)"
                            >
                              <v-sheet
                                color="green"
                                width="20"
                                height="20"
                                class="d-flex align-center justify-center mr-2 rounded-sm"
                              >
                                <v-icon color="white" size="16">mdi-plus</v-icon>
                              </v-sheet>
                              <span class="text-caption font-weight-bold text-medium-emphasis">New item</span>
                            </div>
                            <v-sheet
                              v-else
                              color="success"
                              width="20"
                              height="20"
                              class="d-flex align-center justify-center rounded-sm cursor-pointer"
                              @click="AddTask(item.raw.id)"
                            >
                              <v-icon color="white" size="16">mdi-plus</v-icon>
                            </v-sheet>
                          </div>
                        </v-expand-transition>
                      </div>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- Collapsed View -->
            <v-row
              v-else
              no-gutters
              class="py-1 align-center bg-grey-lighten-4 my-1 cursor-pointer"
              @click="() => toggleExpand(item)"
            >
              <v-col cols="12" class="d-flex align-center px-1 py-1">
                <v-icon size="x-small" class="mr-1">mdi-chevron-right</v-icon>
                <div class="d-flex align-center">
                  <v-icon :color="item.raw.type === 'Bug' ? 'red' : 'blue'" size="small" class="mr-2">
                    {{ item.raw.type === 'Bug' ? 'mdi-bug' : 'mdi-clipboard-text' }}
                  </v-icon>
                  <span class="text-body-2 font-weight-medium text-truncate">{{ item.raw.title }}</span>
                </div>
                <v-spacer></v-spacer>
                <v-chip size="x-small" class="mr-2">{{ item.raw.status }}</v-chip>
              </v-col>
            </v-row>
          </v-expand-transition>
        </div>
      </template>
    </v-data-iterator>

    <!-- Side Panels -->
    <v-navigation-drawer
      v-if="store.sprint.showDetails"
      location="right"
      width="400"
      permanent
    >
      <v-card flat>
        <v-card-title class="d-flex align-center">
          <span class="text-h6">Work Details</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="onCloseSide"></v-btn>
        </v-card-title>
        <v-card-text>
          <!-- Details content placeholder -->
          <div class="text-body-2">Details content here...</div>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-if="store.sprint.showSprints"
      location="right"
      width="300"
      permanent
    >
      <SprintsSider
        :sprints="props.sprints"
        @after-move="LoadWorkItemsWithBurndown"
        @close-side="onCloseSide"
      />
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from 'vue'
import { getGetSprintWorkItems, postCreateWorkItem } from '@/apis/workitem';
import { postCreateTask, putMoveTask, putUpdateWorkHours } from '@/apis/task';
import { getGetSprint } from '@/apis/sprint';
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { VueDraggable } from 'vue-draggable-plus'
import WorkItemCard from '@/components/sprint/WorkItemCard.vue';
import TaskCard from '@/components/sprint/TaskCard.vue';
import SprintsSider from '@/components/sprint/SprintsSider.vue';

const props = defineProps({
  sprints: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['task-changed'])
const store = useAppStore()
const route = useRoute()

const sprint = ref({
  members: []
})
const workItemType = ref('')
const workItems = ref([])
const creatingWorkItem = ref(false)
const creatingTask = ref(false)
const createWorkItemTitle = ref(null)
const createTaskTitle = ref(null)
const rightTaskTitle = ref(null)
const createTaskWorkItemId = ref(0)
const expanded = ref([])

function getTaskCount(status) {
  const key = 'tasks' + status.replace(' ', '');
  return workItems.value.reduce((acc, item) => {
    return acc + (item[key] ? item[key].length : 0);
  }, 0);
}

function LoadWorkItems(sprintId) {
  const id = sprintId || route.params.sprintId
  expanded.value = []
  getGetSprintWorkItems(route.params.orgId, route.params.projectId, id, {
    page: 1,
    size: -1
  }).then(res => {
    if (id == route.params.sprintId) {
      workItems.value = res.data.items
      workItems.value.forEach(item => {
        if (item.status === 'Done') {
          expanded.value.push(item.id.toString())
        }
      })
    }
  })
}

function AddWorkItem(type) {
  creatingWorkItem.value = !creatingWorkItem.value
  workItemType.value = type
  if (creatingWorkItem.value) {
    nextTick(() => {
      createWorkItemTitle.value?.focus()
    })
  }
}

function onCloseSide() {
  store.setSidebar('')
}

function AddTask(workItemId) {
  creatingTask.value = !creatingTask.value
  createTaskWorkItemId.value = workItemId

  if (creatingTask.value) {
    nextTick(() => {
      setTimeout(() => {
         const el = document.getElementById(workItemId + '-createTaskTitle');
         if (el) el.focus();
      }, 100);
    })
  }
}

function onCreateTask() {
  const element = document.getElementById(createTaskWorkItemId.value + '-createTaskTitle');
  const title = element ? element.value : '';

  if (creatingTask.value === true && title && createTaskWorkItemId.value > 0) {
    postCreateTask(route.params.orgId, route.params.projectId, createTaskWorkItemId.value, {
      sprintId: route.params.sprintId,
      title: title
    }).then(res => {
      for (let i = 0; i < workItems.value.length; i++) {
        if (workItems.value[i].id === createTaskWorkItemId.value) {
          workItems.value[i].tasksAll.push(res.data.item)
          workItems.value[i].tasksToDo.push(res.data.item)
        }
      }
      emit('task-changed')
    })
  }
  creatingTask.value = false
}

function onCreatWorkItem() {
  const title = createWorkItemTitle.value?.value || '';

  if (creatingWorkItem.value === true && title) {
    postCreateWorkItem(route.params.orgId, route.params.projectId, {
      title: title,
      sprintId: route.params.sprintId,
      type: workItemType.value,
    }).then(res => {
      workItems.value.unshift(res.data.item)
    })
  }
  creatingWorkItem.value = false
}

function filterTasks(userId) {
  let myItems = []
  if (userId != "00000000-0000-0000-0000-000000000000") {
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
  store.setSidebar(type)
}

function collapseAll() {
  if (expanded.value.length > 0) {
    expanded.value = []
  } else {
    expanded.value = []
    workItems.value.forEach(item => {
      expanded.value.push(item.id.toString())
    })
  }
}

function onAdd(item) {
  let moveTo = item.to.id
  let split = moveTo.split('-')
  let workItemId = split[0]
  let status = split[1]
  let taskId = item.data.id
  putMoveTask(route.params.orgId, route.params.projectId, workItemId, taskId, {
    status: status,
    toWorkItemId: workItemId,
  }).then(res => {
    const task = workItems.value.find((item) => item.id == workItemId)['tasks' + status].find((task) => task.id == taskId)
    task.status = status
    task.workItemId = workItemId
    if (status === 'Done') {
      task.remainingWork = 0
      putUpdateWorkHours(route.params.orgId, route.params.projectId, workItemId, taskId, {
        remaining: 0
      })
    }
    emit('task-changed')
  })
}

function LoadSprint(sprintId) {
  const id = sprintId || route.params.sprintId
  getGetSprint(route.params.orgId, route.params.projectId, id).then(res => {
    if (id == route.params.sprintId) {
      sprint.value = res.data.item
    }
  })
}

function updateTask(action, task) {
  const workItem = workItems.value.find(item => item.id == task.workItemId);
  if (!workItem) return;

  if (action === 'assign') {
    const targetTask = workItem['tasks' + task.status].find(t => t.id == task.id);
    if (targetTask) {
      if (!targetTask.assignUser) {
        targetTask.assignUser = { id: null, name: null };
      }
      targetTask.assignUser.id = task.assignUser.id;
      targetTask.assignUser.name = task.assignUser.name;
    }
  } else if (action === 'remaining') {
    const targetTask = workItem['tasks' + task.status].find(t => t.id == task.id);
    if (targetTask) {
      targetTask.remainingWork = task.remainingWork;
    }
  } else if (action === 'delete') {
    const taskList = workItem['tasks' + task.status];
    if (taskList) {
      const index = taskList.findIndex(t => t.id == task.id);
      if (index !== -1) {
        taskList.splice(index, 1);
      }
    }
  } else {
    // Move task
    const sourceList = workItem['tasks' + action];
    const targetList = workItem['tasks' + task.status];

    if (sourceList && targetList) {
      const taskIndex = sourceList.findIndex(t => t.id == task.id);
      if (taskIndex !== -1) {
        const [movedTask] = sourceList.splice(taskIndex, 1);
        movedTask.status = task.status;
        movedTask.remainingWork = task.remainingWork;
        targetList.push(movedTask);
      }
    }
  }
  emit('task-changed');
}

function updateWorkItem(action, workItem) {
  if (action == 'assign') {
    workItems.value.find((item) => item.id == workItem.id).assignUser.id = workItem.assignUser.id
  } else {
    workItems.value.find((item) => item.id == workItem.id).status = workItem.status
  }
}

function LoadWorkItemsWithBurndown() {
  LoadWorkItems()
  emit('task-changed')
}

onMounted(() => {
  LoadSprint()
  LoadWorkItems()
  emit('task-changed')
})

watch(() => route.params.sprintId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    LoadSprint(newId)
    LoadWorkItems(newId)
    emit('task-changed')
  }
})
</script>
