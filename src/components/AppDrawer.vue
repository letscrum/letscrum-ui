<template>
  <v-navigation-drawer
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <!-- <v-toolbar>

    </v-toolbar> -->
    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home-city" title="Home" value="home" to="/projects"></v-list-item>
    </v-list>
    <v-list density="compact" nav v-if="store.project.id > 0">
      <v-list-item prepend-icon="mdi-home-city" title="Overview" value="overview" :to="'/projects/' + store.project.id"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="Sprints" value="sprints" :to="'/projects/' + store.project.id + '/sprints'"></v-list-item>
    </v-list>
    <v-list density="compact" nav v-if="store.sprint.id > 0">
      <v-list-item prepend-icon="mdi-home-city" title="Current Sprint" value="current_sprint" :to="'/projects/' + store.project.id + '/sprints/' + store.sprint.id"></v-list-item>
    </v-list>
    <template v-slot:append>

      <v-list>
        <!-- <v-list-item :prepend-icon="rail ? 'mdi-chevron-right' : ''" @click="rail = !rail" v-if="rail">

        </v-list-item> -->
        <v-list-item>
          <template v-slot:append>
            <v-btn
              :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
              variant="text"
              :style="rail ? 'margin-left: -12px; margin-right: 12px;' : ''"
              @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </template>
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
