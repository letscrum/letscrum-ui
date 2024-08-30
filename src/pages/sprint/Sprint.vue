<template>
  <DefaultLayout>
    <v-row no-gutters>
      <v-col>
        <h2>{{ store.sprint.name }}</h2>
      </v-col>
      <v-col>
        <SprintStatus></SprintStatus>
      </v-col>
    </v-row>

    <v-tabs>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId">Taskboard</v-tab>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId + '/backlog'">Backlog</v-tab>
      <v-tab :to="'/orgs/' + store.org.id + '/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId + '/capacity'">Capacity</v-tab>
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
      <component :is="Component" ref="mainContent" :sprints="sprints" />
    </router-view>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const route = useRoute()
const sprints = ref([])


const mainContent = ref()

function onCreateWorkItem(workItemType) {
  console.log('create work item', workItemType)
  mainContent.value.AddWorkItem(workItemType)
}

function onShowSide(type) {
  mainContent.value.showSide(type)
}

function onReLoadSprint() {
  mainContent.value.reloadSprint()
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
}

function onSetMember(memberId) {
  mainContent.value.filterTasks(memberId)
}

function onLoadSprints(getSprints) {
  sprints.value = getSprints
}

</script>
