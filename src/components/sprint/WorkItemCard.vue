<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      class="ado-board-card ado-board-card--work-item"
      :style="{ '--ado-card-accent': borderColor }"
      rounded="sm"
    >
      <div class="pa-2">
        <!-- Header -->
        <div class="ado-board-card__header d-flex align-start">
          <v-icon :style="{ color: borderColor }" size="small" class="mr-1">
            {{ props.workItem.type == 'Backlog' ? 'mdi-clipboard-text' : 'mdi-bug' }}
          </v-icon>
          <div class="ado-board-card__id mr-1">{{ localWorkItem.id }}</div>
          <div class="ado-board-card__title flex-grow-1" :class="{ 'pr-4': isHovering || isMenuOpen }" :title="localWorkItem.title">
            <div v-if="!isEditingTitle">
              <ItemDetail item-type="WORKITEM" :item-id="localWorkItem.id" @after-update="onDetailUpdate">
                <span>{{ localWorkItem.title }}</span>
              </ItemDetail>
            </div>
            <input
              v-else
              ref="titleInput"
              v-model="localWorkItem.title"
              type="text"
              class="ado-inline-input w-100"
              @blur="finishEditingTitle"
              @keydown.enter="finishEditingTitle"
            />
          </div>
        </div>

        <!-- Assignee -->
        <div class="ado-board-card__meta d-flex align-center mb-2">
          <v-menu location="bottom start">
            <template #activator="{ props: menuProps }">
              <button type="button" class="ado-board-card__assignee" v-bind="menuProps">
                <UserAvatar
                  v-if="localWorkItem.assignUser"
                  :user-id="localWorkItem.assignUser.id"
                  :user-name="localWorkItem.assignUser.name"
                  size="20"
                  class="mr-2"
                />
                <v-avatar v-else size="20" class="mr-2 ado-unassigned-avatar">
                  <v-icon size="x-small">mdi-account</v-icon>
                </v-avatar>
                <span class="text-caption text-medium-emphasis text-truncate">
                  {{ localWorkItem.assignUser ? localWorkItem.assignUser.name : 'Unassigned' }}
                </span>
              </button>
            </template>
            <v-list density="compact" max-height="200">
              <v-list-item
                v-for="member in localMembers"
                :key="member.userId"
                :value="member.userId"
                style="min-height: 30px;"
                @click="assignWorkItemValue(member.userId)"
              >
                <template #prepend>
                  <UserAvatar :user-id="member.userId" :user-name="member.userName" size="20" class="mr-2" />
                </template>
                <v-list-item-title style="font-size: 12px;">{{ member.userName }}</v-list-item-title>
              </v-list-item>
              <v-list-item style="min-height: 30px;" @click="assignWorkItemValue('00000000-0000-0000-0000-000000000000')">
                <v-list-item-title style="font-size: 12px;">Unassigned</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- State -->
        <div class="ado-board-card__state d-flex align-center justify-space-between">
          <span class="text-caption text-medium-emphasis">State</span>
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <button type="button" class="ado-board-card__state-button" v-bind="menuProps">
                <v-icon :color="statusColor" size="x-small" class="mr-1">mdi-circle</v-icon>
                <span class="text-caption">{{ localWorkItem.status }}</span>
              </button>
            </template>
            <v-list density="compact">
              <v-list-item v-for="s in ['New', 'Approved', 'Done', 'Removed']" :key="s" style="min-height: 30px;" @click="updateStatusValue(s)">
                <template #prepend>
                  <v-icon :color="getStatusColor(s)" size="x-small" class="mr-2">mdi-circle</v-icon>
                </template>
                <v-list-item-title style="font-size: 12px;">{{ s }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <!-- Actions (Hover only) -->
      <div class="ado-board-card__actions position-absolute top-0 right-0 pa-1" :class="{ 'ado-board-card__actions--visible': isHovering || isMenuOpen }">
        <v-menu v-model="isMenuOpen">
          <template #activator="{ props: menuProps }">
            <v-btn aria-label="Work item actions" icon="mdi-dots-horizontal" variant="text" density="compact" size="small" v-bind="menuProps"></v-btn>
          </template>
          <v-list density="compact">
            <v-list-item style="min-height: 30px;" @click="startEditingTitle">
              <template #prepend><v-icon size="small">mdi-pencil</v-icon></template>
              <v-list-item-title style="font-size: 12px;">Edit Title</v-list-item-title>
            </v-list-item>
            <v-list-item style="min-height: 30px;" @click="onDelete(localWorkItem.id)">
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
import { computed, ref } from 'vue';
import { putAssignWorkItem, putUpdateWorkItemStatus, putUpdateWorkItem, deleteDeleteWorkItem } from '@/apis/workitem';
import { useRoute } from 'vue-router';
import UserAvatar from '@/components/user/UserAvatar.vue';
import ItemDetail from '@/components/sprint/ItemDetail.vue';

const props = defineProps({
  workItem: {
    type: Object,
    required: true
  },
  members: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['afterUpdate', 'addTask']);
const route = useRoute();

const localWorkItem = ref(props.workItem);
const localMembers = computed(() => props.members);
const isMenuOpen = ref(false);
const isEditingTitle = ref(false);
const titleInput = ref(null);

const borderColor = computed(() => props.workItem.type == 'Backlog'
  ? 'rgb(var(--v-theme-type-backlog))'
  : 'rgb(var(--v-theme-type-bug))');
const statusColor = computed(() => getStatusColor(localWorkItem.value.status));

function getStatusColor(status) {
  switch (status) {
    case 'Done': return 'success';
    case 'Approved': return 'primary';
    case 'New': return 'grey';
    default: return 'grey';
  }
}

function assignWorkItemValue(userId) {
  putAssignWorkItem(route.params.orgId, route.params.projectId, localWorkItem.value.id, {
    assignUserId: userId,
  }).then(() => {
    const user = localMembers.value.find(m => m.userId === userId);
    localWorkItem.value.assignUser = user ? { id: user.userId, name: user.userName } : { id: null, name: null };
    emit('afterUpdate', 'assign', localWorkItem.value);
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
  putUpdateWorkItem(route.params.orgId, route.params.projectId, localWorkItem.value.id, {
    title: localWorkItem.value.title
  }).then((res) => {
    if (res.status === 200) {
      emit('afterUpdate', 'update', localWorkItem.value);
    }
  });
}

function onDetailUpdate(updatedItem) {
  Object.assign(localWorkItem.value, updatedItem)
  emit('afterUpdate', 'update', localWorkItem.value)
}

function onDelete(workItemId) {
  deleteDeleteWorkItem(route.params.orgId, route.params.projectId, workItemId).then((res) => {
    if (res.status === 200) {
      emit('afterUpdate', 'delete', localWorkItem.value);
    }
  });
}

function updateStatusValue(status) {
  putUpdateWorkItemStatus(route.params.orgId, route.params.projectId, localWorkItem.value.id, {
    status: status,
  }).then(() => {
    localWorkItem.value.status = status;
    emit('afterUpdate', 'status', localWorkItem.value);
  });
}
</script>

