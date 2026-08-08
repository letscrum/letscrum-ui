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
        <component
          :is="Component"
          ref="mainContent"
          :sprints="sprints"
          :sprints-loading="sprintsLoading"
          :sprints-ready="sprintsReady"
        />
      </router-view>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getGetSprints } from '@/apis/sprint';
import { useDelayedLoading } from '@/composables/useDelayedLoading'

const route = useRoute()
const sprints = ref([])
const mainContent = ref()
const {
  loading: sprintsLoading,
  ready: sprintsReady,
  run: runSprintsLoading
} = useDelayedLoading()

function onCreateWorkItemFromBacklog() {
  mainContent.value?.LoadWorkItems()
}

function loadSprints() {
  void runSprintsLoading(async () => {
    const res = await getGetSprints(route.params.orgId, route.params.projectId, {
      page: 1,
      size: -1
    })
    sprints.value = res.data.items || []
  }).catch(() => {})
}

onMounted(() => {
  loadSprints()
})
</script>
