<template>
  <v-menu v-if="route.name == 'SprintTaskboard'" offset-y bottom left>
    <template #activator="{ props }">
      <v-btn v-bind="props" append-icon="mdi-chevron-down" style="margin-top: 6px;" variant="text">
        {{ member.userName }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item title="All" @click="setMember('all', 'All')"></v-list-item>
      <v-list-item title="@Me" @click="setMember(store.user.id, '@Me')"></v-list-item>

      <v-list-item
        v-for="(item, i) in sprint.members"
        :key="i"
        :title="item.userName"
        @click="setMember(item.userId, item.userName)"
      >
      </v-list-item>
    </v-list>
  </v-menu>
  <v-menu offset-y bottom left width="400">
    <template #activator="{ props }">
      <v-btn v-bind="props" append-icon="mdi-chevron-down" style="margin-top: 6px;" variant="text">
        {{ store.sprint.name }}
      </v-btn>
    </template>
    <v-list>
      <v-virtual-scroll height="320" item-height="64" :items="sprints">
        <template #default="{ item }">
          <v-list-item
            :to="'/orgs/' + store.org.id + '/projects/' + item.projectId + '/sprints/' + item.id"
            lines="two"
            :title="item.name"
            :subtitle="new Date(item.startDate * 1000).toISOString().substring(0, 10) + ' - ' + new Date(item.endDate * 1000).toISOString().substring(0, 10)"
            @click="onSetSprint(item.id, item.name, item.startDate, item.endDate, item.burndownType)"
          >
            <template #append>
              <v-chip
                :color="item.status === 'Current' ? 'primary' : ''"
                :variant="item.status === 'Current' ? 'flat' : 'tonal'"
              >
                {{ item.status }}
              </v-chip>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
      <v-divider class="my-2"></v-divider>
      <SprintCreate @after-create="LoadSprints()">
        <v-list-item title="New Sprint" @click="console.log()">
          <template #prepend>
            <v-icon>mdi-plus</v-icon>
          </template>
        </v-list-item>
      </SprintCreate>
    </v-list>
  </v-menu>
  <v-menu bottom left offset-y>
    <template #activator="{ props }">
      <v-btn v-bind="props" icon="mdi-order-bool-ascending" variant="text" density="comfortable" style="margin-top: 6px;">
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-subheader>用户中心</v-list-subheader>

      <v-list-item @click="onShowSide('details')">
        <v-list-item-title>Work details</v-list-item-title>
      </v-list-item>
      <v-list-item @click="onShowSide('sprints')">
        <v-list-item-title>Sprints</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
const emit = defineEmits(['afterSetSprint', 'afterSetMember', 'afterLoadSprints', 'afterShowSide'])

import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue'
import { getGetSprints } from '@/apis/sprint';

const store = useAppStore()
const route = useRoute()

const sprints = ref([])
const sprint = ref({})

const member = ref({
  userId: 0,
  userName: 'All'
})

function onSetSprint(id, name, startDate, endDate, burndownType) {
  store.setSprint({
    id: id,
    name: name,
    startDate: startDate,
    endDate: endDate,
    burndownType: burndownType,
  })
  emit('afterSetSprint')
}

function setMember(userId, userName) {
  member.value.userId = userId
  member.value.userName = userName
  emit('afterSetMember', userId)
}

onMounted(() => {
  LoadSprints()
})

function LoadSprints() {
  getGetSprints(store.org.id, route.params.projectId, {
    page: 1,
    size: 999
  }).then((res) => {
    console.log(res);
    if (res.status === 200) {
      sprints.value = res.data.items;
      emit('afterLoadSprints', sprints.value)
      console.log(sprints.value);
      // get sprints status 'Current' item and set to store
      if (store.sprint.id === 0) {
        const currentSprint = sprints.value.find((item) => item.status === 'Current')
        if (currentSprint) {
          store.setSprint({
            id: currentSprint.id,
            name: currentSprint.name,
            startDate: currentSprint.startDate,
            endDate: currentSprint.endDate,
            burndownType: currentSprint.burndownType,
          })
          sprint.value = currentSprint
        }
      } else {
        const currentSprint = sprints.value.find((item) => item.id === route.params.sprintId)
        sprint.value = currentSprint
      }
      console.log(sprint.value)
    }
  })
}

function onShowSide(type) {
  emit('afterShowSide', type)
}

</script>
