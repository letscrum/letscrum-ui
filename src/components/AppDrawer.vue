<template>
  <v-navigation-drawer
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-toolbar>
      <v-btn
        :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
        variant="text"
        @click.stop="rail = !rail"
      ></v-btn>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" to="/projects"></v-list-item>
    </v-list>
    <v-list density="compact" nav v-if="store.project.id > 0">
      <v-list-item prepend-icon="mdi-home-city" title="Overview" value="overview" :to="'/projects/' + store.project.id"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="Sprints" value="sprints" :to="'/projects/' + store.project.id + '/sprints'"></v-list-item>
      <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item>
    </v-list>


  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

defineProps(['menus'])

const store = useAppStore()

const rail = computed({
  get() {
    return store.rail;
  },
  set(val) {
    store.setRail(val);
  }
})
</script>
