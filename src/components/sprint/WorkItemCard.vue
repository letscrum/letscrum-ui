<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      :elevation="isHovering ? 3 : 1"
      class="ma-1"
      :style="`border-left: 4px solid ${borderColor};`"
      width="170"
      rounded="0"
    >
      <div class="pa-3">
        <!-- Header -->
        <div class="d-flex align-start mb-6">
          <v-icon :color="borderColor" size="12" class="mt-1 mr-2">
            {{ props.workItem.type == 'Backlog' ? 'mdi-clipboard-text' : 'mdi-bug' }}
          </v-icon>
          <div class="text-caption font-weight-bold mr-1">{{ localWorkItem.id }}</div>
          <div class="text-caption flex-grow-1" style="min-width: 0;" :title="localWorkItem.title">
            <ItemDetail item-type="WORKITEM" :item-id="localWorkItem.id">
              <span class="cursor-pointer text-decoration-underline-hover">{{ localWorkItem.title }}</span>
            </ItemDetail>
          </div>
        </div>

        <!-- Assignee -->
        <div class="d-flex align-center mb-2">
          <v-menu location="bottom start">
            <template #activator="{ props: menuProps }">
              <div class="d-flex align-center cursor-pointer" v-bind="menuProps">
                <UserAvatar
                  v-if="localWorkItem.assignUser"
                  :user-id="localWorkItem.assignUser.id"
                  :user-name="localWorkItem.assignUser.name"
                  size="20"
                  class="mr-2"
                />
                <v-avatar v-else size="20" color="grey-lighten-2" class="mr-2">
                  <v-icon size="x-small">mdi-account</v-icon>
                </v-avatar>
                <span class="text-caption text-medium-emphasis text-truncate" style="max-width: 100px; font-size: 11px !important;">
                  {{ localWorkItem.assignUser ? localWorkItem.assignUser.name : 'Unassigned' }}
                </span>
              </div>
            </template>
            <v-list density="compact" max-height="200">
              <v-list-item
                v-for="member in localMembers"
                :key="member.userId"
                :value="member.userId"
                @click="assignWorkItemValue(member.userId)"
              >
                <template #prepend>
                  <UserAvatar :user-id="member.userId" :user-name="member.userName" size="24" class="mr-2" />
                </template>
                <v-list-item-title>{{ member.userName }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="assignWorkItemValue('00000000-0000-0000-0000-000000000000')">
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
                <span class="text-caption" style="font-size: 11px !important;">{{ localWorkItem.status }}</span>
              </div>
            </template>
            <v-list density="compact">
              <v-list-item v-for="s in ['New', 'Approved', 'Done', 'Removed']" :key="s" @click="updateStatusValue(s)">
                <template #prepend>
                  <v-icon :color="getStatusColor(s)" size="x-small" class="mr-2">mdi-circle</v-icon>
                </template>
                <v-list-item-title>{{ s }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-card>
  </v-hover>
</template>

<script setup>
import { computed, ref } from 'vue';
import { putAssignWorkItem, putUpdateWorkItemStatus } from '@/apis/workitem';
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

const borderColor = computed(() => props.workItem.type == 'Backlog' ? '#009CCC' : '#CC293D');
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
  }).then((res) => {
    const user = localMembers.value.find(m => m.userId === userId);
    localWorkItem.value.assignUser = user ? { id: user.userId, name: user.userName } : { id: null, name: null };
    emit('afterUpdate', 'assign', localWorkItem.value);
  });
}

function updateStatusValue(status) {
  putUpdateWorkItemStatus(route.params.orgId, route.params.projectId, localWorkItem.value.id, {
    status: status,
  }).then((res) => {
    localWorkItem.value.status = status;
    emit('afterUpdate', 'status', localWorkItem.value);
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
