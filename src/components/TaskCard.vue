<template>
  <v-sheet border rounded class="pa-1 ma-1" style="border-left-color: rgb(242, 203, 29); border-left-width: 3px; max-width: 180px;">
    <input type="text" class="task-text" :value="localTask.title"><br />
    <select name="example" class="task-text" @change="assignTask" :value="localTask.assignUser.id">
      <option v-for="(member, i) in localMembers" :key="i" :value="member.userId">
        {{ member.userName }}
      </option>
      <option value="00000000-0000-0000-0000-000000000000">Unassigned</option>
    </select>


  </v-sheet>
</template>

<script setup>
const props = defineProps(['task', 'status', 'members']);

import { putAssignTask } from '@/apis/task';
import { onMounted, ref } from 'vue';

import { useRoute } from 'vue-router';

const route = useRoute();

const localTask = ref(props.task);
const localMembers = ref(props.members);

function assignTask(select) {
  console.log(select)
  putAssignTask(route.params.orgId, route.params.projectId, localTask.value.workItemId, localTask.value.id, {
    assignUserId: select.target.value,
  }).then((res) => {
    console.log(res)
  })
}

onMounted(() => {
})
</script>

<style scoped>

.task-text {
  font-size: 12px;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
}

.task-text:hover {
  border-color: silver;
}

</style>
