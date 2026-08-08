<template>
  <DefaultLayout>
    <template #subheader>
      <div class="ado-subheader">
        <v-icon class="mr-2" color="primary">mdi-format-list-bulleted</v-icon>
        <span class="ado-subheader__title">Product Backlog</span>
        <span class="ado-subheader__sub d-none d-sm-inline">All work items across sprints</span>
        <v-spacer />
        <div class="ado-toolbar-actions">
          <router-view
            name="menu"
            @after-create="onCreateWorkItemFromBacklog"
          />
        </div>
      </div>
    </template>

    <div class="ado-workspace">
      <router-view v-slot="{ Component }">
        <component :is="Component" ref="mainContent" :sprints="sprints" />
      </router-view>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getGetSprints } from '@/apis/sprint';

const route = useRoute()
const sprints = ref([])
const mainContent = ref()

function onCreateWorkItemFromBacklog() {
  mainContent.value?.LoadWorkItems()
}

function loadSprints() {
  getGetSprints(route.params.orgId, route.params.projectId, {
    page: 1,
    size: -1
  }).then(res => {
    sprints.value = res.data.items || []
  })
}

onMounted(() => {
  loadSprints()
})
</script>
