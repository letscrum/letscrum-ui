<template>
  <v-sheet border rounded class="pa-1 ma-1" :style="'border-left-color: ' + (props.workItem.type == 'Backlog' ? 'rgb(0, 156, 204)' : 'rgb(204, 41, 61)') + '; border-left-width: 3px;'">
    <ItemDetail  item-type="WORKITEM" :item-id="localWorkItem.id">
      <input readonly type="text" class="item-card-text" :value="localWorkItem.id + ' ' + localWorkItem.title"><br />
    </ItemDetail>
    <select name="example" class="item-card-text" :value="localWorkItem.assignUser.id" @change="assignWorkItem">
      <option v-for="(member, i) in localMembers" :key="i" :value="member.userId">
        {{ member.userName }}
      </option>
      <option value="00000000-0000-0000-0000-000000000000">Unassigned</option>
    </select><br />
    <select name="status" class="item-card-text" :value="localWorkItem.status" @change="updateStatus">
      <option v-for="(s, i) in ['New', 'Approved', 'Done', 'Removed']" :key="i" :value="s">
        {{ s }}
      </option>
    </select>
  </v-sheet>
</template>

<script setup>
const props = defineProps(['workItem', 'members'])
import { ref } from 'vue';

import { putAssignWorkItem, putUpdateWorkItemStatus } from '@/apis/workitem';
const emit = defineEmits(['afterUpdate'])
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
    localWorkItem.value.assignUser.id = select.target.value
    emit('afterUpdate', 'assign', localWorkItem.value)
  })
}


function updateStatus(select) {
  console.log(select)
  putUpdateWorkItemStatus(route.params.orgId, route.params.projectId, localWorkItem.value.id, {
    status: select.target.value,
  }).then((res) => {
    console.log(res)
    localWorkItem.value.status = select.target.value
    emit('afterUpdate', 'status', localWorkItem.value)
  })
}

</script>
