<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>Backlog</h2>
      </v-col>
    </v-row>

    <v-tabs>
      <router-view
        name="menu"
        @after-create="onCreateWorkItemFromBacklog"
      >
      </router-view>
      <router-view
        name="sprintMenu"
        @after-set-sprint="onSetSprint"
        @after-set-member="onSetMember"
        @after-load-sprints="onLoadSprints"
        @after-show-side="onShowSide"
      >
      </router-view>
    </v-tabs>
    <router-view v-slot="{ Component }">
      <component :is="Component" ref="mainContent" :sprints="sprints" />
    </router-view>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getSprintItemBurndown } from '@/apis/sprint';
import { onMounted } from 'vue';

const store = useAppStore()

const route = useRoute()
const sprints = ref([])
const burndown = ref({
  labels: [],
  values: [],
})


const mainContent = ref()

function onCreateWorkItemFromBacklog() {
  mainContent.value.LoadWorkItems()
}

function onShowSide(type) {
  mainContent.value.showSide(type)
}

function onSetSprint() {
  mainContent.value.LoadWorkItems()
  onLoadBurndown()
}

function onSetMember(memberId) {
  mainContent.value.filterTasks(memberId)
}

function onLoadSprints(getSprints) {
  sprints.value = getSprints
}

function onLoadBurndown() {
  getSprintItemBurndown(route.params.orgId, route.params.projectId, store.sprint.id).then((res) => {
    console.log(res)
    // get res.data.burndown list date convert to date unix timestamp to date format and set to labels value
    burndown.value.labels = res.data.burndown.map((item) => new Date(item.date * 1000).toISOString().substring(5, 7) + '/' + new Date(item.date * 1000).toISOString().substring(8, 10))

    // get res.data.burndown list actual and set to value value
    burndown.value.values = res.data.burndown.map((item) => item.actual)
  })
}

onMounted(() => {
  onLoadBurndown()
})

</script>
