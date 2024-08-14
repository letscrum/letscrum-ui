<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    @click="rail = false"
  >
    <v-divider></v-divider>
    <v-list v-if="route.name == 'Orgs' || route.name == 'Projects' || route.name == 'OrgMembers'">
      <v-list-item v-for="org in store.orgs" :key="org.id" @click="onLoadOrg(org)" prepend-icon="mdi-home-city" :title="org.name" :to="'/orgs/' + org.id + '/projects'"></v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item v-if="store.project.id != '' && store.project.id != null && store.org.id != '' && store.org.id != null" prepend-icon="mdi-home-city" title="Overview" value="overview" :to="'/orgs/' + store.org.id + '/projects/' + store.project.id"></v-list-item>
      <v-list-item v-if="store.project.id != '' && store.project.id != null && store.org.id != '' && store.org.id != null && store.sprint.id != '' && store.sprint.id != null" prepend-icon="mdi-home-city" title="Sprint" value="sprint" :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id"></v-list-item>
    </v-list>
    <template #append>
      <v-list>
        <v-list-item>
          <v-btn v-if="route.name != 'Orgs' && route.name != 'Users' && store.org.id != null && store.org.id != ''" block :to="'/orgs/' + store.org.id + '/members'">
            Manage
          </v-btn>
          <v-btn v-else-if="store.user.isSuperAdmin == 'true' || store.user.isSuperAdmin == true " block :to="'/users'">
            Users
          </v-btn>
          <template v-if="!mobile" #append>
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
import { useDisplay } from 'vuetify'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()

defineProps(['menus'])

const store = useAppStore()

const rail = computed({
  get() {
    return mobile.value == true ? false : store.rail;
  },
  set(val) {
    store.setRail(val);
  }
})

const drawer = computed({
  get() {
    return mobile.value == true ? store.drawer : true
  },
  set(val) {
    store.setDrawer(val)
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
