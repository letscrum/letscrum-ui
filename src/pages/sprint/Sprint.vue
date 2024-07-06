<template>
  <DefaultLayout>
    <v-tabs>
      <v-tab :to="'/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId">Taskboard</v-tab>
      <v-tab :to="'/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId + '/backlog'">Backlog</v-tab>
      <v-tab :to="'/projects/' + route.params.projectId + '/sprints/' + route.params.sprintId + '/capacity'">Capacity</v-tab>
      <v-divider
        vertical
        inset
        class="mx-2"
      ></v-divider>
      <router-view name="menu" />
    </v-tabs>
    <v-divider></v-divider>
    <router-view />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
