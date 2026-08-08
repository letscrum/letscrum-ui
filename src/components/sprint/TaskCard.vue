<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      class="ado-board-card ado-board-card--task"
      style="--ado-card-accent: rgb(var(--v-theme-type-task));"
      rounded="sm"
    >
      <div class="pa-2">
        <!-- Header -->
        <div class="ado-board-card__header d-flex align-start">
          <v-icon color="type-task" size="small" class="mr-1">mdi-checkbox-marked-circle-outline</v-icon>
          <div class="ado-board-card__id mr-1">{{ localTask.id }}</div>
          <div class="ado-board-card__title flex-grow-1" :class="{ 'pr-4': isHovering || isMenuOpen }" :title="localTask.title">
            <div v-if="!isEditingTitle">
              <ItemDetail item-type="TASK" :item-id="localTask.id" @after-update="onDetailUpdate">
                <span>{{ localTask.title }}</span>
              </ItemDetail>
            </div>
            <input
              v-else
              ref="titleInput"
              v-model="localTask.title"
              type="text"
              class="ado-inline-input w-100"
              @blur="finishEditingTitle"
              @keydown.enter="finishEditingTitle"
            />
          </div>
        </div>

        <!-- Assignee & Remaining -->
        <div class="ado-board-card__meta d-flex align-center justify-space-between mb-2">
          <!-- Assignee -->
          <v-menu location="bottom start">
            <template #activator="{ props: menuProps }">
              <button type="button" class="ado-board-card__assignee" v-bind="menuProps">
                <UserAvatar
                  v-if="localTask.assignUser"
                  :user-id="localTask.assignUser.id"
                  :user-name="localTask.assignUser.name"
                  size="20"
                  class="mr-2"
                />
                <v-avatar v-else size="20" class="mr-2 ado-unassigned-avatar">
                  <v-icon size="x-small">mdi-account</v-icon>
                </v-avatar>
                <span class="text-caption text-medium-emphasis text-truncate">
                  {{ localTask.assignUser ? localTask.assignUser.name : 'Unassigned' }}
                </span>
              </button>
            </template>
            <v-list density="compact" max-height="200">
              <v-list-item
                v-for="member in localMembers"
                :key="member.userId"
                :value="member.userId"
                style="min-height: 30px;"
                @click="assignTaskValue(member.userId)"
              >
                <template #prepend>
                  <UserAvatar :user-id="member.userId" :user-name="member.userName" size="20" class="mr-2" />
                </template>
                <v-list-item-title style="font-size: 12px;">{{ member.userName }}</v-list-item-title>
              </v-list-item>
              <v-list-item style="min-height: 30px;" @click="assignTaskValue('00000000-0000-0000-0000-000000000000')">
                <v-list-item-title style="font-size: 12px;">Unassigned</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Remaining -->
          <div class="ado-task-card__remaining d-flex align-center">
            <button
              v-if="!isEditingRemaining"
              type="button"
              class="ado-remaining-button text-caption w-100 px-1 d-flex align-center justify-end"
              aria-label="Edit remaining work"
              @click="startEditingRemaining"
            >
              {{ localTask.remainingWork > 0 ? localTask.remainingWork + ' h' : '0 h' }}
            </button>
            <input
              v-else
              ref="remainingInput"
              v-model.number="localTask.remainingWork"
              type="number"
              class="ado-inline-input text-caption text-right w-100 px-1"
              @blur="finishEditingRemaining"
              @keydown.enter="finishEditingRemaining"
            />
          </div>
        </div>

        <!-- State -->
        <div class="ado-board-card__state d-flex align-center justify-space-between">
          <span class="text-caption text-medium-emphasis">State</span>
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <button type="button" class="ado-board-card__state-button" v-bind="menuProps">
                <v-icon :color="statusColor" size="x-small" class="mr-1">mdi-circle</v-icon>
                <span class="text-caption">{{ statusLabel(localTask.status) }}</span>
              </button>
            </template>
            <v-list density="compact">
              <v-list-item v-for="s in ['ToDo', 'InProgress', 'Done', 'Removed']" :key="s" style="min-height: 30px;" @click="updateStatusValue(s)">
                <template #prepend>
                  <v-icon :color="getStatusColor(s)" size="x-small" class="mr-2">mdi-circle</v-icon>
                </template>
                <v-list-item-title>{{ statusLabel(s) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <!-- Actions (Hover only) -->
      <div class="ado-board-card__actions position-absolute top-0 right-0 pa-1" :class="{ 'ado-board-card__actions--visible': isHovering || isMenuOpen }">
        <v-menu v-model="isMenuOpen">
          <template #activator="{ props: menuProps }">
            <v-btn aria-label="Task actions" icon="mdi-dots-horizontal" variant="text" density="compact" size="small" v-bind="menuProps"></v-btn>
          </template>
          <v-list density="compact">
            <v-list-item style="min-height: 30px;" @click="startEditingTitle">
              <template #prepend><v-icon size="small">mdi-pencil</v-icon></template>
              <v-list-item-title style="font-size: 12px;">Edit Title</v-list-item-title>
            </v-list-item>
            <v-list-item style="min-height: 30px;" @click="onDelete(localTask.id)">
              <template #prepend><v-icon size="small" color="error">mdi-delete</v-icon></template>
              <v-list-item-title class="text-error" style="font-size: 12px;">Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue';
import { putAssignTask, putMoveTask, deleteDeleteTask, putUpdateWorkHours, putUpdateTask } from '@/apis/task';
import { useRoute } from 'vue-router';
import UserAvatar from '@/components/user/UserAvatar.vue';
import ItemDetail from '@/components/sprint/ItemDetail.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  members: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['afterUpdate']);
const route = useRoute();

const localTask = ref(props.task);
if (localTask.value.remainingWork === undefined) {
  localTask.value.remainingWork = localTask.value.remaining_work || localTask.value.remaining || 0;
}
const localMembers = computed(() => props.members);
const isEditingRemaining = ref(false);
const remainingInput = ref(null);
const isMenuOpen = ref(false);
const isEditingTitle = ref(false);
const titleInput = ref(null);

const statusColor = computed(() => getStatusColor(localTask.value.status));

function getStatusColor(status) {
  switch (status) {
    case 'Done': return 'success';
    case 'InProgress': return 'primary';
    case 'ToDo': return 'grey';
    default: return 'grey';
  }
}

function statusLabel(status) {
  const labels = {
    ToDo: 'To Do',
    InProgress: 'In Progress'
  }
  return labels[status] || status
}

function assignTaskValue(userId) {
  putAssignTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, localTask.value.id, {
    assignUserId: userId,
  }).then(() => {
    const user = localMembers.value.find(m => m.userId === userId);
    localTask.value.assignUser = user ? { id: user.userId, name: user.userName } : { id: null, name: null };
    emit('afterUpdate', 'assign', localTask.value);
  });
}

function startEditingRemaining() {
  isEditingRemaining.value = true;
  nextTick(() => {
    if (remainingInput.value) {
      remainingInput.value.focus();
    }
  });
}

function finishEditingRemaining() {
  if (!isEditingRemaining.value) return;
  isEditingRemaining.value = false;
  updateRemainingWork();
}

function updateRemainingWork() {
  const work = parseInt(localTask.value.remainingWork);
  const val = isNaN(work) ? 0 : work;
  putUpdateWorkHours(route.params.orgId, route.params.projectId, localTask.value.workItemId, localTask.value.id, {
    remaining: val
  }).then((res) => {
    if (res.status === 200) {
      emit('afterUpdate', 'remaining', localTask.value);
    }
  });
}

function startEditingTitle() {
  isEditingTitle.value = true;
  isMenuOpen.value = false;
  setTimeout(() => {
    if (titleInput.value) {
      titleInput.value.focus();
    }
  }, 100);
}

function finishEditingTitle() {
  if (!isEditingTitle.value) return;
  isEditingTitle.value = false;
  updateTitle();
}

function updateTitle() {
  putUpdateTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, localTask.value.id, {
    title: localTask.value.title
  }).then((res) => {
    if (res.status === 200) {
      emit('afterUpdate', 'update', localTask.value);
    }
  });
}

function onDetailUpdate(updatedItem) {
  Object.assign(localTask.value, updatedItem)
  emit('afterUpdate', 'update', localTask.value)
}

function updateStatusValue(status) {
  let oldStatus = localTask.value.status;
  putMoveTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, localTask.value.id, {
    status: status,
    toWorkItemId: localTask.value.workItemId,
  }).then((res) => {
    if (res.status === 200) {
      localTask.value.status = status;
      if (status === 'Done') {
        localTask.value.remainingWork = 0;
      }
      emit('afterUpdate', oldStatus, localTask.value);
    }
  });
}

function onDelete(taskId) {
  deleteDeleteTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, taskId).then((res) => {
    if (res.status === 200) {
      emit('afterUpdate', 'delete', localTask.value);
    }
  });
}
</script>
<style scoped>
.ado-task-card__remaining {
  width: 40px;
  flex: 0 0 40px;
}
</style>

