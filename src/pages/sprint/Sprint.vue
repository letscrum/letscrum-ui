<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>{{ store.sprint.name }}</h2>
      </v-col>
      <v-col align="right">
        <SprintBurndown :burndown-data="burndown"></SprintBurndown>
      </v-col>
    </v-row>

    <v-tabs>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id" exact>Taskboard</v-tab>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id + '/backlog'">Backlog</v-tab>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id + '/capacity'">Capacity</v-tab>
      <v-divider
        vertical
        inset
        class="mx-2"
      ></v-divider>
      <router-view
        v-if="route.name == 'SprintTaskboard'"
        name="menu"
        @create-work-item="onCreateWorkItem"
      >
      </router-view>
      <router-view
        v-if="route.name == 'SprintBacklog'"
        name="menu"
        @after-create="onCreateWorkItemFromBacklog"
      >
      </router-view>
      <router-view
        v-if="route.name == 'SprintCapacity'"
        name="menu"
        @after-add="onReLoadSprint"
        @after-add-from-project="onAddFromProject"
        @after-save="onSave"
        @after-undo="onUndo"
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
      <component :is="Component" ref="mainContent" :sprints="sprints" @task-changed="onLoadBurndown" />
    </router-view>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { getSprintTaskBurndown, getSprintWorkBurnDown } from '@/apis/sprint';
import { onMounted } from 'vue';

const store = useAppStore()

const route = useRoute()
const sprints = ref([])
const burndown = ref({
  labels: [],
  values: [],
})


const mainContent = ref()

function onCreateWorkItem(workItemType) {
  console.log('create work item', workItemType)
  mainContent.value.AddWorkItem(workItemType)
}

function onCreateWorkItemFromBacklog() {
  mainContent.value.LoadWorkItems()
}

function onShowSide(type) {
  mainContent.value.showSide(type)
}

function onReLoadSprint() {
  mainContent.value.reloadSprint()
  onLoadBurndown()
}

function onAddFromProject() {
  mainContent.value.addAllMembersFromProject()
}

function onSave() {
  mainContent.value.saveMembers()
}

function onUndo() {
  mainContent.value.undoMembers()
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
  console.log('reload burndown')
  if (store.sprint.burndownType == 'ByHour') {
    getSprintWorkBurnDown(route.params.orgId, route.params.projectId, store.sprint.id).then((res) => {
      console.log(res)
      // get res.data.burndown list date convert to date unix timestamp to date format and set to labels value
      burndown.value.labels = res.data.burndown.map((item) => new Date(item.date * 1000).toISOString().substring(5, 7) + '/' + new Date(item.date * 1000).toISOString().substring(8, 10))

      // get res.data.burndown list actual and set to value value
      burndown.value.values = res.data.burndown.map((item) => item.actual)
    })
  } else {
    getSprintTaskBurndown(route.params.orgId, route.params.projectId, store.sprint.id).then((res) => {
      console.log(res)
      // get res.data.burndown list date convert to date unix timestamp to date format and set to labels value
      burndown.value.labels = res.data.burndown.map((item) => new Date(item.date * 1000).toISOString().substring(5, 7) + '/' + new Date(item.date * 1000).toISOString().substring(8, 10))

      // get res.data.burndown list actual and set to value value
      burndown.value.values = res.data.burndown.map((item) => item.actual)
    })
  }

}

onMounted(() => {
  onLoadBurndown()
})

</script>
