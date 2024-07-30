<template>
  <v-sheet border rounded class="pa-1 ma-1" :style="'border-left-color: ' + (props.workItem.type == 'Backlog' ? 'rgb(0, 156, 204)' : 'rgb(204, 41, 61)') + '; border-left-width: 3px;'">
    <input type="text" class="item-card-text" :value="localWorkItem.id + ' ' + localWorkItem.title"><br />
    <select name="example" class="item-card-text" @change="assignWorkItem" :value="localWorkItem.assignUser.id">
      <option v-for="(member, i) in localMembers" :key="i" :value="member.userId">
        {{ member.userName }}
      </option>
      <option value="00000000-0000-0000-0000-000000000000">Unassigned</option>
    </select>
  </v-sheet>
</template>

<script setup>
const props = defineProps(['workItem', 'status', 'members'])
import { onMounted, ref } from 'vue';

import { putAssignWorkItem } from '@/apis/workitem';
// console.log(props.workItem)
import { useRoute } from 'vue-router';
const route = useRoute();

const localWorkItem = ref(props.workItem);
const localMembers = ref(props.members);

function assignWorkItem(select) {
  console.log(select)
  putAssignWorkItem(route.params.orgId, route.params.projectId, localWorkItem.value.id, {
    assignUserId: select.target.value,
  }).then((res) => {
    console.log(res)
  })
}

</script>
