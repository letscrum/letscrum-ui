<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const store = useAppStore()

watch(
  [() => route.path, () => store.project.name, () => store.sprint.name],
  () => {
    const baseTitle = route.meta.title
    let fullTitle = baseTitle

    if (route.params.projectId && store.project.name) {
      if (route.params.sprintId && store.sprint.name) {
        fullTitle = `${store.sprint.name} - ${store.project.name} - ${baseTitle}`
      } else {
        fullTitle = `${store.project.name} - ${baseTitle}`
      }
    }

    if (fullTitle) {
      document.title = `${fullTitle} - Letscrum`
    } else {
      document.title = 'Letscrum - Lightweight Scrum & Agile Project Management System'
    }
  },
  { immediate: true }
)
</script>
