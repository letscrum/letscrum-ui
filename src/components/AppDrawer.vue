<template>
  <v-navigation-drawer
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="John Leider"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
    </v-list-item>

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
