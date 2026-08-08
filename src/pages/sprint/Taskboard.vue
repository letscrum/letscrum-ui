<template>
  <div class="ado-taskboard h-100">
    <v-card
      v-if="creatingWorkItem"
      class="ado-create-composer ado-create-composer--work-item"
        :style="{
          '--ado-create-accent': workItemType === 'Bug'
            ? 'rgb(var(--v-theme-type-bug))'
            : 'rgb(var(--v-theme-type-backlog))'
        }"
    >
        <div class="ado-create-composer__header">
          <div class="ado-create-composer__type">
            <v-icon :color="workItemType === 'Bug' ? 'type-bug' : 'type-backlog'" size="20">
              {{ workItemType === 'Bug' ? 'mdi-bug-outline' : 'mdi-clipboard-text-outline' }}
            </v-icon>
            <div>
              <div class="ado-create-composer__title">
                New {{ workItemType === 'Bug' ? 'bug' : 'backlog item' }}
              </div>
              <div class="ado-create-composer__subtitle">Add work to {{ sprint.name || 'this sprint' }}</div>
            </div>
          </div>
          <v-btn
            aria-label="Cancel new work item"
            icon="mdi-close"
            variant="text"
            size="small"
            :disabled="creatingWorkItemSaving"
            @click="cancelWorkItem"
          />
        </div>
        <div class="ado-create-composer__content">
          <v-textarea
            ref="createWorkItemTitle"
            v-model="newWorkItemTitle"
            label="Title"
            placeholder="Enter a clear title"
            rows="2"
            max-rows="4"
            auto-grow
            no-resize
            variant="outlined"
            density="compact"
            hide-details="auto"
            autofocus
            @keydown.ctrl.enter.prevent="onCreateWorkItem"
            @keydown.esc.prevent="cancelWorkItem"
          />
          <v-alert v-if="workItemCreateError" type="error" variant="tonal" density="compact" class="mt-2">
            {{ workItemCreateError }}
          </v-alert>
        </div>
        <div class="ado-create-composer__actions">
          <v-btn variant="text" size="small" :disabled="creatingWorkItemSaving" @click="cancelWorkItem">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            :loading="creatingWorkItemSaving"
            :disabled="!newWorkItemTitle.trim()"
            @click="onCreateWorkItem"
          >
            Create
          </v-btn>
        </div>
    </v-card>

    <div v-if="loading" class="ado-board-loading">
      <v-skeleton-loader type="heading" width="220" class="mb-3" />
      <div class="d-flex" style="gap: 8px; min-width: 800px;">
        <v-skeleton-loader v-for="column in 4" :key="column" type="card, card" class="flex-grow-1" />
      </div>
    </div>

    <div v-else-if="!ready" class="ado-board-pending" aria-hidden="true"></div>

    <div v-else-if="workItems.length === 0 && !creatingWorkItem" class="ado-empty-state d-flex flex-column align-center justify-center">
      <v-icon size="48" class="text-medium-emphasis mb-3">mdi-view-column-outline</v-icon>
      <div class="text-subtitle-1 font-weight-medium">No work items in this sprint</div>
      <div class="text-body-2 text-medium-emphasis mt-1">Create a backlog item or bug to start planning work.</div>
      <div class="d-flex align-center mt-4" style="gap: 8px;">
        <v-btn color="primary" variant="flat" size="small" prepend-icon="mdi-plus" @click="AddWorkItem('Backlog')">
          New backlog item
        </v-btn>
        <v-btn color="error" variant="outlined" size="small" prepend-icon="mdi-bug-outline" @click="AddWorkItem('Bug')">
          Report bug
        </v-btn>
      </div>
    </div>

    <v-data-iterator
      v-else-if="workItems.length > 0"
      v-model:expanded="expanded"
      :items="workItems"
      hide-default-footer
      items-per-page="-1"
      class="h-100"
    >
      <template #header>
        <v-row no-gutters class="flex-nowrap mt-1">
          <v-col cols="auto" class="ado-work-item-column">
            <div class="d-flex align-center justify-space-between mb-1" style="height: 28px;">
              <v-btn
                v-if="expanded.length > 0"
                variant="text"
                prepend-icon="mdi-arrow-collapse-vertical"
                size="small"
                @click="collapseAll()"
              >
                Collapse all
              </v-btn>
              <v-btn
                v-else
                variant="text"
                prepend-icon="mdi-arrow-expand-vertical"
                size="small"
                @click="collapseAll()"
              >
                Expand all
              </v-btn>
            </div>

          </v-col>

          <v-col class="ado-task-area flex-grow-1">
            <v-row no-gutters>
              <v-col v-for="header in ['To Do', 'In Progress', 'Done']" :key="header" cols="4" class="ado-task-column px-1">
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
              <v-col cols="auto" class="ado-work-item-column px-1 d-flex align-start">
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
                    ghost-class="ado-drag-ghost"
                    chosen-class="ado-drag-chosen"
                    drag-class="ado-drag-active"
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
              <v-col class="ado-task-area flex-grow-1">
                <v-row no-gutters class="h-100">
                  <v-col v-for="status in ['To Do', 'In Progress', 'Done']" :key="status" cols="4" class="ado-task-column pl-1 h-100">
                    <v-sheet
                      class="ado-subtle d-flex flex-column fill-height rounded-0 pa-0"
                      min-height="100"
                    >
                      <VueDraggable
                        :id="item.raw.id + '-' + status.replace(' ', '')"
                        v-model="item.raw['tasks' + status.replace(' ', '')]"
                        group="task"
                        class="ado-task-drop-zone flex-grow-1 d-flex flex-wrap align-content-start"
                        :animation="150"
                        ghost-class="ado-drag-ghost"
                        chosen-class="ado-drag-chosen"
                        drag-class="ado-drag-active"
                        @add="onAdd"
                      >
                        <div
                          v-for="task in item.raw['tasks' + status.replace(' ', '')]"
                          :key="task.id"
                          class="ado-task-card-wrap"
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
                              class="ado-create-composer ado-create-composer--task"
                              style="--ado-create-accent: rgb(var(--v-theme-type-task));"
                            >
                              <div class="ado-create-composer__header">
                                <div class="ado-create-composer__type">
                                  <v-icon color="type-task" size="18">mdi-checkbox-marked-circle-outline</v-icon>
                                  <div class="ado-create-composer__title">New task</div>
                                </div>
                                <v-btn
                                  aria-label="Cancel new task"
                                  icon="mdi-close"
                                  variant="text"
                                  size="small"
                                  :disabled="creatingTaskSaving"
                                  @click="cancelTask"
                                />
                              </div>
                              <div class="ado-create-composer__content">
                                <v-textarea
                                  :id="item.raw.id + '-createTaskTitle'"
                                  v-model="newTaskTitle"
                                  label="Title"
                                  placeholder="Enter task title"
                                  rows="2"
                                  max-rows="4"
                                  auto-grow
                                  no-resize
                                  variant="outlined"
                                  density="compact"
                                  hide-details="auto"
                                  @keydown.ctrl.enter.prevent="onCreateTask"
                                  @keydown.esc.prevent="cancelTask"
                                />
                                <v-alert v-if="taskCreateError" type="error" variant="tonal" density="compact" class="mt-2">
                                  {{ taskCreateError }}
                                </v-alert>
                              </div>
                              <div class="ado-create-composer__actions">
                                <v-btn variant="text" size="small" :disabled="creatingTaskSaving" @click="cancelTask">Cancel</v-btn>
                                <v-btn
                                  color="primary"
                                  variant="flat"
                                  size="small"
                                  :loading="creatingTaskSaving"
                                  :disabled="!newTaskTitle.trim()"
                                  @click="onCreateTask"
                                >
                                  Create
                                </v-btn>
                              </div>
                            </v-card>
                          </div>
                          <div v-else class="pa-1 mb-1">
                            <v-btn
                              prepend-icon="mdi-plus"
                              variant="text"
                              color="primary"
                              size="small"
                              @click="AddTask(item.raw.id)"
                            >
                              New task
                            </v-btn>
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
              class="py-1 align-center ado-subtle ado-border my-1 cursor-pointer rounded-sm"
              role="button"
              tabindex="0"
              aria-expanded="false"
              @click="() => toggleExpand(item)"
              @keydown.enter.prevent="() => toggleExpand(item)"
              @keydown.space.prevent="() => toggleExpand(item)"
            >
              <v-col cols="12" class="d-flex align-center px-2 py-1">
                <v-icon size="x-small" class="mr-1">mdi-chevron-right</v-icon>
                <div class="d-flex align-center">
                  <v-icon :color="item.raw.type === 'Bug' ? 'type-bug' : 'type-backlog'" size="small" class="mr-2">
                    {{ item.raw.type === 'Bug' ? 'mdi-bug' : 'mdi-clipboard-text-outline' }}
                  </v-icon>
                  <span class="text-body-2 font-weight-medium text-truncate">{{ item.raw.title }}</span>
                </div>
                <v-spacer></v-spacer>
                <v-chip size="x-small" variant="tonal" class="mr-2">{{ item.raw.status }}</v-chip>
              </v-col>
            </v-row>
          </v-expand-transition>
        </div>
      </template>
    </v-data-iterator>

    <!-- Side Panels -->
    <v-navigation-drawer
      v-if="store.sprint.showSprints"
      location="right"
      width="320"
      permanent
    >
      <SprintsSider
        :sprints="props.sprints"
        :loading="props.sprintsLoading"
        :ready="props.sprintsReady"
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
import { useDelayedLoading } from '@/composables/useDelayedLoading'

const props = defineProps({
  sprints: {
    type: Array,
    required: true
  },
  sprintsLoading: {
    type: Boolean,
    default: false
  },
  sprintsReady: {
    type: Boolean,
    default: false
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
const creatingWorkItemSaving = ref(false)
const creatingTaskSaving = ref(false)
const {
  loading,
  ready,
  reset: resetLoading,
  run: runLoading
} = useDelayedLoading()
const newWorkItemTitle = ref('')
const newTaskTitle = ref('')
const workItemCreateError = ref('')
const taskCreateError = ref('')
const createWorkItemTitle = ref(null)
const createTaskWorkItemId = ref(0)
const expanded = ref([])

function getTaskCount(status) {
  const key = 'tasks' + status.replace(' ', '');
  return workItems.value.reduce((acc, item) => {
    return acc + (item[key] ? item[key].length : 0);
  }, 0);
}

function LoadWorkItems(sprintId, resetView = false) {
  const id = sprintId || route.params.sprintId
  if (resetView) {
    resetLoading()
    workItems.value = []
  }
  expanded.value = []
  void runLoading(async () => {
    const res = await getGetSprintWorkItems(route.params.orgId, route.params.projectId, id, {
      page: 1,
      size: -1
    })
    if (id == route.params.sprintId) {
      workItems.value = res.data.items
      workItems.value.forEach(item => {
        if (item.status === 'Done') {
          expanded.value.push(item.id.toString())
        }
      })
    }
  }).catch(() => {})
}

function AddWorkItem(type) {
  creatingWorkItem.value = true
  workItemType.value = type
  workItemCreateError.value = ''
  nextTick(() => {
    createWorkItemTitle.value?.focus()
  })
}

function cancelWorkItem() {
  if (creatingWorkItemSaving.value) return
  creatingWorkItem.value = false
  newWorkItemTitle.value = ''
  workItemCreateError.value = ''
}

function onCloseSide() {
  store.setSidebar('')
}

function AddTask(workItemId) {
  creatingTask.value = true
  createTaskWorkItemId.value = workItemId
  newTaskTitle.value = ''
  taskCreateError.value = ''

  if (creatingTask.value) {
    nextTick(() => {
      setTimeout(() => {
         const el = document.getElementById(workItemId + '-createTaskTitle');
         if (el) el.focus();
      }, 100);
    })
  }
}

function cancelTask() {
  if (creatingTaskSaving.value) return
  creatingTask.value = false
  createTaskWorkItemId.value = 0
  newTaskTitle.value = ''
  taskCreateError.value = ''
}

async function onCreateTask() {
  const title = newTaskTitle.value.trim();

  if (!creatingTask.value || !title || createTaskWorkItemId.value <= 0) return

  creatingTaskSaving.value = true
  taskCreateError.value = ''
  try {
    const res = await postCreateTask(route.params.orgId, route.params.projectId, createTaskWorkItemId.value, {
      sprintId: route.params.sprintId,
      title: title
    })
    for (let i = 0; i < workItems.value.length; i++) {
      if (workItems.value[i].id === createTaskWorkItemId.value) {
        workItems.value[i].tasksAll.push(res.data.item)
        workItems.value[i].tasksToDo.push(res.data.item)
      }
    }
    creatingTask.value = false
    createTaskWorkItemId.value = 0
    newTaskTitle.value = ''
    emit('task-changed')
  } catch (error) {
    taskCreateError.value = error.response?.data?.message || 'Unable to create this task. Try again.'
  } finally {
    creatingTaskSaving.value = false
  }
}

async function onCreateWorkItem() {
  const title = newWorkItemTitle.value.trim();

  if (!creatingWorkItem.value || !title) return

  creatingWorkItemSaving.value = true
  workItemCreateError.value = ''
  try {
    const res = await postCreateWorkItem(route.params.orgId, route.params.projectId, {
      title: title,
      sprintId: route.params.sprintId,
      type: workItemType.value,
    })
    workItems.value.unshift(res.data.item)
    creatingWorkItem.value = false
    newWorkItemTitle.value = ''
    emit('task-changed')
  } catch (error) {
    workItemCreateError.value = error.response?.data?.message || 'Unable to create this work item. Try again.'
  } finally {
    creatingWorkItemSaving.value = false
  }
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
  }).then(() => {
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
  const targetIndex = workItems.value.findIndex((item) => item.id == workItem.id)
  if (targetIndex === -1) return
  if (action === 'delete') {
    workItems.value.splice(targetIndex, 1)
  } else if (action === 'assign') {
    workItems.value[targetIndex].assignUser = workItem.assignUser
  } else if (action === 'status') {
    workItems.value[targetIndex].status = workItem.status
  } else if (action === 'update') {
    Object.assign(workItems.value[targetIndex], workItem)
  }
}

function LoadWorkItemsWithBurndown() {
  LoadWorkItems()
  emit('task-changed')
}

onMounted(() => {
  LoadSprint()
  LoadWorkItems(undefined, true)
  emit('task-changed')
})

watch(() => route.params.sprintId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    LoadSprint(newId)
    LoadWorkItems(newId, true)
    emit('task-changed')
  }
})
</script>

<style scoped>
.ado-taskboard {
  --ado-work-item-column: 226px;
  --ado-task-column: clamp(220px, 24vw, 320px);
  overflow-x: auto;
}
.ado-board-loading {
  min-width: 800px;
  padding: 12px;
}
.ado-board-pending {
  min-width: 800px;
  min-height: 320px;
}
.ado-create-composer {
  overflow: hidden;
  border: 1px solid var(--ado-border) !important;
  border-left: 3px solid var(--ado-create-accent) !important;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: var(--ado-shadow-md) !important;
}
.ado-create-composer--work-item {
  width: min(440px, calc(100vw - 40px));
  margin: 4px 0 12px 4px;
  animation: ado-composer-enter 160ms ease-out;
}
.ado-create-composer--task {
  width: 190px;
  margin: 4px;
}
.ado-create-composer__header {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px 6px 12px;
  border-bottom: 1px solid var(--ado-border);
  background-color: var(--ado-subtle-bg);
}
.ado-create-composer__type {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}
.ado-create-composer__title {
  color: rgb(var(--v-theme-on-surface));
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
}
.ado-create-composer__subtitle {
  overflow: hidden;
  color: var(--ado-text-secondary);
  font-size: 12px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ado-create-composer__content {
  padding: 10px 12px 8px;
}
.ado-create-composer__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  padding: 0 12px 10px;
}
.ado-create-composer--task .ado-create-composer__header {
  min-height: 40px;
  padding-left: 8px;
}
.ado-create-composer--task .ado-create-composer__content {
  padding: 8px;
}
.ado-create-composer--task .ado-create-composer__actions {
  padding: 0 8px 8px;
}
@keyframes ado-composer-enter {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.ado-work-item-column {
  width: var(--ado-work-item-column);
  min-width: var(--ado-work-item-column);
  max-width: var(--ado-work-item-column);
}
.ado-task-area {
  min-width: calc(var(--ado-task-column) * 3);
}
.ado-task-column {
  min-width: var(--ado-task-column);
}
.ado-task-drop-zone {
  min-height: 72px;
  padding-bottom: 4px;
}
.ado-task-card-wrap {
  width: 198px;
  flex: 0 0 198px;
}
.ado-drag-ghost {
  opacity: 0.35;
}
.ado-drag-chosen {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 1px;
}
.ado-drag-active {
  transform: rotate(0.4deg);
}
.ado-subtle {
  background-color: var(--ado-subtle-bg);
}
.ado-column-header {
  border-bottom: 2px solid var(--ado-border);
}
</style>

