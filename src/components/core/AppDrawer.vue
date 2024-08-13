<template>
  <v-navigation-drawer
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <!-- <v-toolbar>

    </v-toolbar> -->
    <v-divider></v-divider>
    <div v-if="route.name == 'Orgs' || route.name == 'Projects' || route.name == 'OrgMembers'">
      <v-list density="compact" nav v-for="org in store.orgs" :key="org.id" @click="onLoadOrg(org)">
        <v-list-item prepend-icon="mdi-home-city" :title="org.name" :to="'/orgs/' + org.id + '/projects'"></v-list-item>
      </v-list>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home-city" title="New Org" value="new"></v-list-item>
      </v-list>
    </div>
    <div v-else>
      <v-list v-if="store.project.id != '' && store.project.id != null && store.org.id != '' && store.org.id != null" density="compact" nav>
        <v-list-item prepend-icon="mdi-home-city" title="Overview" value="overview" :to="'/orgs/' + store.org.id + '/projects/' + store.project.id"></v-list-item>
      </v-list>
      <v-list v-if="store.project.id != '' && store.project.id != null && store.org.id != '' && store.org.id != null && store.sprint.id != '' && store.sprint.id != null" density="compact" nav>
        <v-list-item prepend-icon="mdi-home-city" title="Sprint" value="sprint" :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id"></v-list-item>
      </v-list>
    </div>
    <template #append>
      <v-list>
        <v-list-item v-if="route.name != 'Orgs' && route.name != 'Users' && store.org.id != null && store.org.id != ''">
          <v-btn block :to="'/orgs/' + store.org.id + '/members'">
            Manage
          </v-btn>
          <template #append>
            <v-btn
              :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
              variant="text"
              :style="rail ? 'margin-left: -12px; margin-right: 12px;' : ''"
              @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>
        <v-list-item v-else-if="store.user.isSuperAdmin == 'true' || store.user.isSuperAdmin == true ">
          <v-btn block :to="'/users'">
            Users
          </v-btn>
          <template #append>
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
import { useRoute, useRouter } from 'vue-router'
import { getGetOrg } from '@/apis/org'

const route = useRoute()
const router = useRouter()

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


function onLoadOrg(org) {
  store.setOrg({
    id: org.id,
    name: org.name,
    displayName: org.displayName,
    description: org.description,
  })
  router.push(`/orgs/${org.id}/projects`);
}

</script>
