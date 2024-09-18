<template>
  <v-sheet border rounded class="pa-1 ma-1" style="border-left-color: rgb(242, 203, 29); border-left-width: 3px; max-width: 180px;">
    <ItemDetail item-type="TASK" :item-id="localTask.id">
      <input :readonly="!isEditing" type="text" class="item-card-text" :value="localTask.id + ' ' + localTask.title">
    </ItemDetail>
    <v-menu>
      <template #activator="{ props }">
        <v-btn variant="plain" density="compact" size="small" icon="mdi-plus" v-bind="props"></v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title @click="isEditing = true">Edit</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title @click="onDelete(localTask.id)">Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <br />
    <select name="assign" class="item-card-text" :value="localTask.assignUser.id" @change="assignTask">
      <option v-for="(member, i) in localMembers" :key="i" :value="member.userId">
        {{ member.userName }}
      </option>
      <option value="00000000-0000-0000-0000-000000000000">Unassigned</option>
    </select>
    <input
      type="text"
      class="item-card-text"
      v-model="localTask.remaining"
      @focusout="onUpdateWorkHours(localTask.workItemId, localTask.id)"
      @keyup.enter="onUpdateWorkHours(localTask.workItemId, localTask.id)" />
    <br />
    <select name="status" class="item-card-text" :value="localTask.status" @change="updateStatus">
      <option v-for="(s, i) in ['ToDo', 'InProgress', 'Done', 'Removed']" :key="i" :value="s">
        {{ s }}
      </option>
    </select>
  </v-sheet>
</template>

<script setup>
const props = defineProps(['task', 'members']);

import { putAssignTask, putMoveTask, putUpdateWorkHours, deleteDeleteTask } from '@/apis/task';
import { onMounted, ref } from 'vue';
const emit = defineEmits(['afterUpdate'])


import { useRoute } from 'vue-router';

const route = useRoute();

const localTask = ref(props.task);
const localMembers = ref(props.members);

const isEditing = ref(false)
console.log(localTask.value)

function assignTask(select) {
  console.log(select)
  putAssignTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, localTask.value.id, {
    assignUserId: select.target.value,
  }).then((res) => {
    console.log(res)
    localTask.value.assignUser.id = select.target.value
    emit('afterUpdate', 'assign', localTask.value)
  })
}

function updateStatus(select) {
  console.log(select)
  putMoveTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, localTask.value.id, {
    status: select.target.value,
    toWorkItemId: localTask.value.workItemId,
  }).then((res) => {
    if (res.status === 200) {
      console.log(res)
      let oldStatus = localTask.value.status
      localTask.value.status = select.target.value
      emit('afterUpdate', oldStatus, localTask.value)
    }
  })
}

function onUpdateWorkHours(workItemId, taskId) {
  putUpdateWorkHours(route.params.orgId, route.params.projectId, workItemId, taskId, {
    remaining: localTask.value.remaining,
  }).then((res) => {
    if (res.status === 200) {
      console.log(res)
      emit('afterUpdate', 'remaining', localTask.value)
    }
  })
}

function onDelete(taskId) {
  deleteDeleteTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, taskId).then((res) => {
    console.log(res)
  })
  emit('afterUpdate', 'delete', localTask.value)
}

onMounted(() => {
})
</script>
