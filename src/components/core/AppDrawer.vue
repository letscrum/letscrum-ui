<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    style="background-color: white;"
    @click="rail = false"
  >
    <v-divider></v-divider>
    <v-list v-if="route.name == 'Orgs' || route.name == 'Projects' || route.name == 'Org'">
      <v-list-item>
        <v-list-item-title>
          Orgs
        </v-list-item-title>
        <template #append>
          <OrgCreate>
            <v-btn
              density="compact"
              icon="mdi-plus"
              variant="plain"
              ></v-btn>
          </OrgCreate>
        </template>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="org in store.orgs" :key="org.id" @click="onLoadOrg(org)" :to="'/orgs/' + org.id + '/projects'">
        <v-list-item-title>
          {{ org.name }}
        </v-list-item-title>
        <template #prepend>
          <v-avatar size="x-small" rounded="0" :color="uuidToColor(org.id)">{{ org.name.substring(0, 1) }}</v-avatar>
        </template>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item>
        <v-list-item-title>
          {{ store.project.name }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="store.project.id != '' && store.project.id != null && store.org.id != '' && store.org.id != null" :to="'/orgs/' + store.org.id + '/projects/' + store.project.id">
        <v-list-item-title>
          Overview
        </v-list-item-title>
        <template #prepend>
          <v-avatar size="x-small" rounded="0">
            <v-icon>mdi-trello</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
      <v-list-item v-if="store.project.id != '' && store.project.id != null && store.org.id != '' && store.org.id != null && store.sprint.id != '' && store.sprint.id != null" :to="'/orgs/' + store.org.id + '/projects/' + store.project.id + '/sprints/' + store.sprint.id">
        <v-list-item-title>
          Sprint
        </v-list-item-title>
        <template #prepend>
          <v-avatar size="x-small" rounded="0">
            <v-icon>mdi-view-dashboard</v-icon>
          </v-avatar>
        </template>
      </v-list-item>
    </v-list>
    <template #append>
      <v-list>
        <v-list-item>
          <v-btn v-if="(route.name == 'Projects' || route.name == 'Org') && store.org.id != null && store.org.id != ''" block :to="'/orgs/' + store.org.id" prepend-icon="mdi-cog">
            Manage
          </v-btn>
          <template v-if="!mobile" #append>
            <v-btn
              :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
              variant="text"
              :style="rail ? 'margin-left: -12px; margin-right: 12px;' : ''"
              @click.stop="rail = !rail">
            </v-btn>
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
import { uuidToColor } from '@/utils/utils'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()

defineProps({
  menus: {
    type: Array,
    required: true
  }
})

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
  store.setOrg(org)
  router.push(`/orgs/${org.id}/projects`);
}

</script>
