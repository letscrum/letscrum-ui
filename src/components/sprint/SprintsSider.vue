<template>
  <v-card flat tile>
    <v-card-title>
      <span class="text-h5">Sprints</span>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" @click="onCloseSide">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <VueDraggable
          id="00000000-0000-0000-0000-000000000000"
          v-model="sprintWorkItems"
          group="workItem"
          style="width: 100%; height: 100%;"
          draggable="false"
          @add="onMoveToSprint"
        >
        <v-list-item @click="console.log('backlog')" :to="'/orgs/' + store.org.id + '/projects/' + route.params.projectId + '/backlog'">
          <v-list-item-title>Product Backlog</v-list-item-title>
        </v-list-item>
      </VueDraggable>
      <div v-for="item in props.sprints"
          :key="item.id">
        <VueDraggable
          :id="item.id"
          v-model="sprintWorkItems"
          group="workItem"
          style="width: 100%; height: 100%;"
          draggable="false"
          :disabled="item.id === route.params.sprintId"
          @add="onMoveToSprint"
        >
          <v-list-item
            lines="two"
            :to="'/orgs/' + store.org.id + '/projects/' + item.projectId + '/sprints/' + item.id"
            @click="onSetSprint(item.id, item.name, item.startDate, item.endDate)"
          >

            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ new Date(item.startDate * 1000).toISOString().substring(0, 10) + ' - ' + new Date(item.endDate * 1000).toISOString().substring(0, 10) }}</v-list-item-subtitle>
            <template #append>
              <v-chip
                :color="item.status === 'Current' ? 'primary' : ''"
                :variant="item.status === 'Current' ? 'flat' : 'tonal'"
              >
                {{ item.status }}
              </v-chip>
            </template>

          </v-list-item>

        </VueDraggable>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { VueDraggable } from 'vue-draggable-plus'

import { putMoveWorkItem } from '@/apis/workitem';
import { useAppStore } from '@/stores/app';
import { useRoute } from 'vue-router';

const props = defineProps(['sprints'])
const store = useAppStore()
const route = useRoute()
const emit = defineEmits(['after-move', 'close-side'])
const sprintWorkItems = ref([])


function onMoveToSprint(item) {
  console.log('onMoveToSprint', item)
  console.log('to', item.to)
  console.log('tid', item.to.id)
  console.log('from', item.from)
  console.log('itemid', item.item.id)
  console.log('sprints', props.sprints)
  if ((props.sprints.find((sprint) => sprint.id == item.to.id) && item.item.id != item.to.id && route.params.sprintId != item.to.id)
    || item.to.id == '00000000-0000-0000-0000-000000000000') {
    putMoveWorkItem(store.org.id, route.params.projectId, item.item.id, {
      sprintId: item.to.id,
    }).then(res => {
      console.log('move res', res)
      emit('after-move')
    })
  } else if (item.item.id == item.to.id) {
    return
  } else{
    emit('after-move')
  }

}


function onSetSprint(id, name, startDate, endDate) {
  store.setSprint({
    id: id,
    name: name,
    startDate: startDate,
    endDate: endDate
  })
  emit('after-move')
}

function onCloseSide() {
  emit('close-side')
}

</script>
