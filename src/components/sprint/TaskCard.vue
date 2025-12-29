<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      :elevation="isHovering ? 3 : 1"
      class="ma-1"
      style="border-left: 4px solid #F2CB1D;"
      width="155"
      rounded="lg"
    >
      <div class="pa-3">
        <!-- Header -->
        <div class="d-flex align-start mb-3">
          <v-icon color="#F2CB1D" size="12" class="mt-1 mr-2">mdi-checkbox-marked-circle-outline</v-icon>
          <div class="text-caption font-weight-bold mr-1">{{ localTask.id }}</div>
          <div class="text-caption flex-grow-1" style="min-width: 0;" :title="localTask.title">
            <ItemDetail item-type="TASK" :item-id="localTask.id">
              <span class="cursor-pointer text-decoration-underline-hover">{{ localTask.title }}</span>
            </ItemDetail>
          </div>
        </div>

        <!-- Assignee -->
        <div class="d-flex align-center mb-3">
          <v-menu location="bottom start">
            <template #activator="{ props: menuProps }">
              <div class="d-flex align-center cursor-pointer" v-bind="menuProps">
                <UserAvatar
                  v-if="localTask.assignUser"
                  :user-id="localTask.assignUser.id"
                  :user-name="localTask.assignUser.name"
                  size="20"
                  class="mr-2"
                />
                <v-avatar v-else size="20" color="grey-lighten-2" class="mr-2">
                  <v-icon size="x-small">mdi-account</v-icon>
                </v-avatar>
                <span class="text-caption text-medium-emphasis text-truncate" style="max-width: 100px; font-size: 11px !important;">
                  {{ localTask.assignUser ? localTask.assignUser.name : 'Unassigned' }}
                </span>
              </div>
            </template>
            <v-list density="compact" max-height="200">
              <v-list-item
                v-for="member in localMembers"
                :key="member.userId"
                :value="member.userId"
                @click="assignTaskValue(member.userId)"
              >
                <template #prepend>
                  <UserAvatar :user-id="member.userId" :user-name="member.userName" size="24" class="mr-2" />
                </template>
                <v-list-item-title>{{ member.userName }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="assignTaskValue('00000000-0000-0000-0000-000000000000')">
                <v-list-item-title>Unassigned</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- State -->
        <div class="d-flex align-center justify-space-between">
          <span class="text-caption text-disabled" style="font-size: 11px !important;">State</span>
          <v-menu location="bottom end">
            <template #activator="{ props: menuProps }">
              <div class="d-flex align-center cursor-pointer" v-bind="menuProps">
                <v-icon :color="statusColor" size="x-small" class="mr-1">mdi-circle</v-icon>
                <span class="text-caption" style="font-size: 11px !important;">{{ localTask.status }}</span>
              </div>
            </template>
            <v-list density="compact">
              <v-list-item v-for="s in ['ToDo', 'InProgress', 'Done', 'Removed']" :key="s" @click="updateStatusValue(s)">
                <template #prepend>
                  <v-icon :color="getStatusColor(s)" size="x-small" class="mr-2">mdi-circle</v-icon>
                </template>
                <v-list-item-title>{{ s }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <!-- Actions (Hover only) -->
      <div v-if="isHovering" class="position-absolute top-0 right-0 pa-1">
        <v-menu>
          <template #activator="{ props: menuProps }">
            <v-btn icon="mdi-dots-horizontal" variant="text" density="compact" size="small" v-bind="menuProps"></v-btn>
          </template>
          <v-list density="compact">
            <v-list-item @click="onDelete(localTask.id)">
              <template #prepend><v-icon size="small" color="error">mdi-delete</v-icon></template>
              <v-list-item-title class="text-error">Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup>
import { computed, ref } from 'vue';
import { putAssignTask, putMoveTask, deleteDeleteTask } from '@/apis/task';
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
const localMembers = computed(() => props.members);

const statusColor = computed(() => getStatusColor(localTask.value.status));

function getStatusColor(status) {
  switch (status) {
    case 'Done': return 'success';
    case 'InProgress': return 'primary';
    case 'ToDo': return 'grey';
    default: return 'grey';
  }
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

function updateStatusValue(status) {
  let oldStatus = localTask.value.status;
  putMoveTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, localTask.value.id, {
    status: status,
    toWorkItemId: localTask.value.workItemId,
  }).then((res) => {
    if (res.status === 200) {
      localTask.value.status = status;
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
.cursor-pointer {
  cursor: pointer;
}
.text-decoration-underline-hover:hover {
  text-decoration: underline;
}
</style>
