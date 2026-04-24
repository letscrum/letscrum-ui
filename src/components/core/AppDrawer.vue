<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    :width="240"
    rail-width="48"
    permanent
    color="surface"
    class="ado-drawer"
    :border="true"
  >
    <!-- Mobile breadcrumbs -->
    <v-list v-if="mobile && route.meta.breadcrumbs" density="compact" nav>
      <v-list-item class="pa-0">
        <v-breadcrumbs :items="route.meta.breadcrumbs" density="compact">
          <template #item="{ item }">
            <v-breadcrumbs-item :to="item.to" :disabled="item.to.name === route.name" class="text-caption">
              {{ item.title }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-list-item>
      <v-divider />
    </v-list>

    <!-- ============== USER context ============== -->
    <v-list v-if="context === 'user'" density="compact" nav class="pa-1">
      <v-list-subheader v-if="!rail" class="text-overline">
        {{ $t('user.userMenus.text') }}
      </v-list-subheader>
      <v-list-item
        v-if="store.user.isSuperAdmin"
        to="/users"
        prepend-icon="mdi-account-group-outline"
        :title="$t('user.userMenus.users.text')"
      />
      <v-list-item
        to="/user/profile"
        prepend-icon="mdi-account-circle-outline"
        :title="$t('user.userMenus.profile.text')"
      />
    </v-list>

    <!-- ============== ORG context ============== -->
    <v-list v-else-if="context === 'org'" density="compact" nav class="pa-1">
      <!-- Header: expanded shows title + add button; rail shows just icon -->
      <v-list-item v-if="!rail" class="px-2">
        <template #prepend>
          <v-icon size="small">mdi-domain</v-icon>
        </template>
        <v-list-item-title class="text-overline">Organizations</v-list-item-title>
        <template #append>
          <OrgCreate>
            <v-btn icon="mdi-plus" variant="text" density="compact" size="small" />
          </OrgCreate>
        </template>
      </v-list-item>
      <v-list-item v-else prepend-icon="mdi-domain" class="ado-rail-center">
        <v-tooltip activator="parent" location="end">Organizations</v-tooltip>
      </v-list-item>

      <v-divider class="my-1" />

      <v-list-item
        v-for="org in store.orgs"
        :key="org.id"
        :to="'/orgs/' + org.id + '/projects'"
        :active="org.id === store.org.id"
        @click="onLoadOrg(org)"
      >
        <template #prepend>
          <v-avatar size="24" rounded="sm" :color="uuidToColor(org.id)" class="ado-list-avatar">
            <span class="text-caption font-weight-bold text-white">
              {{ (org.displayName || org.name).substring(0, 1).toUpperCase() }}
            </span>
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2">
          {{ org.displayName || org.name }}
        </v-list-item-title>
      </v-list-item>

      <template v-if="store.org.id">
        <v-divider class="my-1" />
        <v-list-item
          :to="`/orgs/${store.org.id}`"
          prepend-icon="mdi-cog-outline"
          :title="rail ? undefined : 'Organization settings'"
        >
          <v-tooltip v-if="rail" activator="parent" location="end">Organization settings</v-tooltip>
        </v-list-item>
      </template>
    </v-list>

    <!-- ============== PROJECT context ============== -->
    <template v-else-if="context === 'project'">
      <!-- Project header (expanded) / icon (rail) -->
      <v-list v-if="!rail" density="compact" nav class="pa-2">
        <v-list-item class="px-2">
          <template #prepend>
            <v-avatar size="28" rounded="sm" :color="uuidToColor(store.project.id)" class="ado-list-avatar">
              <span class="text-caption font-weight-bold text-white">
                {{ (store.project.displayName || store.project.name || '?').substring(0, 1).toUpperCase() }}
              </span>
            </v-avatar>
          </template>
          <v-list-item-title class="font-weight-bold text-truncate">
            {{ store.project.displayName || store.project.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            {{ store.org.displayName || store.org.name }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list v-else density="compact" nav class="pa-1">
        <v-list-item class="ado-rail-center">
          <template #prepend>
            <v-avatar size="24" rounded="sm" :color="uuidToColor(store.project.id)">
              <span style="font-size: 10px; font-weight: 700; color: white;">
                {{ (store.project.displayName || store.project.name || '?').substring(0, 1).toUpperCase() }}
              </span>
            </v-avatar>
          </template>
          <v-tooltip activator="parent" location="end">{{ store.project.displayName || store.project.name }}</v-tooltip>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list density="compact" nav class="pa-1">
        <v-list-item
          v-for="item in projectMenuItems"
          :key="item.label"
          :to="item.to"
          :exact="item.exact"
          :disabled="item.disabled"
          :prepend-icon="item.icon"
          :title="rail ? undefined : item.label"
        >
          <v-tooltip v-if="rail" activator="parent" location="end">{{ item.label }}</v-tooltip>
        </v-list-item>
      </v-list>
    </template>

    <!-- Footer rail toggle -->
    <template #append>
      <v-divider />
      <div class="d-flex" :class="rail ? 'justify-center' : 'justify-end'" style="padding: 6px;">
        <v-btn
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          variant="text"
          density="compact"
          size="small"
          @click.stop="rail = !rail"
        />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { uuidToColor } from '@/utils/utils'
import OrgCreate from '@/components/org/OrgCreate.vue'

const route = useRoute()
const router = useRouter()
const { mobile } = useDisplay()

const store = useAppStore()

const rail = computed({
  get() {
    return mobile.value === true ? false : store.rail;
  },
  set(val) {
    store.setRail(val);
  }
})

const drawer = computed({
  get() {
    return mobile.value === true ? store.drawer : true
  },
  set(val) {
    store.setDrawer(val)
  }
})

const context = computed(() => {
  if (route.name === 'Users' || (route.path && route.path.startsWith('/user/'))) return 'user'
  if (route.name === 'Orgs' || route.name === 'Projects' || route.name === 'Org') return 'org'
  if (store.project.id) return 'project'
  return 'org'
})

const orgId = computed(() => store.org.id)
const projectId = computed(() => store.project.id)
const sprintId = computed(() => store.sprint.id)

const projectBase = computed(() => `/orgs/${orgId.value}/projects/${projectId.value}`)

const projectMenuItems = computed(() => {
  const base = projectBase.value
  const hasSprint = sprintId.value && sprintId.value !== 'null' && sprintId.value !== ''
  return [
    { label: 'Overview', icon: 'mdi-view-dashboard-outline', to: base, exact: true },
    { label: 'Backlogs', icon: 'mdi-format-list-bulleted', to: `${base}/backlog` },
    { label: 'Sprints', icon: 'mdi-run-fast', to: hasSprint ? `${base}/sprints/${sprintId.value}` : base, disabled: !hasSprint }
  ]
})

function onLoadOrg(org) {
  store.setOrg(org)
  router.push(`/orgs/${org.id}/projects`)
}
</script>

<style scoped>
.ado-drawer :deep(.v-list-item) {
  border-radius: 4px;
  margin: 1px 4px;
  min-height: 36px;
}
.ado-drawer :deep(.v-list-item--active .v-icon) {
  color: rgb(var(--v-theme-primary));
}
/* Center items in rail mode */
.ado-rail-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* Consistent avatar sizing in list prepend slot */
.ado-list-avatar {
  margin-inline-end: 8px;
}
</style>

