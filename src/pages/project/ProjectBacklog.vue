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
import { onMounted } from 'vue';

const sprints = ref([])

const mainContent = ref()

function onCreateWorkItemFromBacklog() {
  mainContent.value.LoadWorkItems()
}

function onShowSide(type) {
  mainContent.value.showSide(type)
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

onMounted(() => {
})

</script>
