<template>
  <v-app-bar
    flat
    density="compact"
    height="48"
    class="ado-app-bar"
    color="surface"
    :border="true"
  >
    <v-app-bar-nav-icon
      v-if="mobile && store.isSignedIn"
      @click="store.setDrawer(!store.drawer)"
    ></v-app-bar-nav-icon>

    <!-- Logo -->
    <div
      class="d-flex align-center cursor-pointer mx-2"
      style="height: 100%;"
      @click="onLogoClick"
    >
      <v-img
        :src="store.logoUrl"
        contain
        width="120"
        max-width="120"
        height="28"
      />
    </div>

    <!-- Org / Project switcher (only when signed in) -->
    <template v-if="store.isSignedIn && !mobile">
      <v-divider vertical class="mx-1" />

      <!-- Org switcher -->
      <v-menu offset="4">
        <template #activator="{ props: actProps }">
          <v-btn
            v-bind="actProps"
            variant="text"
            density="comfortable"
            class="px-2 text-none"
            :ripple="false"
          >
            <v-avatar
              v-if="store.org.id"
              size="20"
              rounded="sm"
              :color="uuidToColor(store.org.id)"
              class="mr-2"
            >
              <span class="text-caption font-weight-bold text-white">
                {{ (store.org.displayName || store.org.name || '?').substring(0, 1).toUpperCase() }}
              </span>
            </v-avatar>
            <v-icon v-else size="small" class="mr-2">mdi-domain</v-icon>
            <span class="font-weight-medium">
              {{ store.org.displayName || store.org.name || 'Select organization' }}
            </span>
            <v-icon size="x-small" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-card min-width="280" max-width="320" class="ado-border">
          <v-list density="compact" max-height="360" class="overflow-y-auto">
            <v-list-subheader class="text-caption">Organizations</v-list-subheader>
            <v-list-item
              v-for="o in store.orgs"
              :key="o.id"
              :active="o.id === store.org.id"
              @click="onSwitchOrg(o)"
            >
              <template #prepend>
                <v-avatar size="22" rounded="sm" :color="uuidToColor(o.id)">
                  <span class="text-caption font-weight-bold text-white">
                    {{ (o.displayName || o.name).substring(0, 1).toUpperCase() }}
                  </span>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2">
                {{ o.displayName || o.name }}
              </v-list-item-title>
            </v-list-item>
            <v-divider class="my-1" />
            <v-list-item @click="router.push('/orgs')">
              <template #prepend><v-icon size="small">mdi-view-grid-outline</v-icon></template>
              <v-list-item-title class="text-body-2">All organizations</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <!-- Project chip / link -->
      <template v-if="store.org.id && store.project.id">
        <v-icon size="x-small" class="mx-1 text-medium-emphasis">mdi-slash-forward</v-icon>
        <v-btn
          variant="text"
          density="comfortable"
          class="px-2 text-none"
          :to="`/orgs/${store.org.id}/projects/${store.project.id}`"
          :ripple="false"
        >
          <v-icon size="small" class="mr-2">mdi-folder-outline</v-icon>
          <span class="font-weight-medium">{{ store.project.displayName || store.project.name }}</span>
        </v-btn>
      </template>
      <template v-else-if="store.org.id">
        <v-icon size="x-small" class="mx-1 text-medium-emphasis">mdi-slash-forward</v-icon>
        <v-btn
          variant="text"
          density="comfortable"
          class="px-2 text-none text-medium-emphasis"
          :to="`/orgs/${store.org.id}/projects`"
          :ripple="false"
        >
          Projects
        </v-btn>
      </template>
    </template>

    <v-spacer></v-spacer>

    <!-- Action icons -->
    <template v-if="store.isSignedIn">
      <v-tooltip text="Help" location="bottom">
        <template #activator="{ props: tProps }">
          <v-btn v-bind="tProps" icon variant="text" density="comfortable" href="https://github.com/letscrum" target="_blank">
            <v-icon size="20">mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>

    <v-tooltip :text="$t('core.toLanguage')" location="bottom">
      <template #activator="{ props: tProps }">
        <v-btn v-bind="tProps" icon variant="text" density="comfortable" @click="changeLanguage">
          <v-icon size="20">mdi-translate</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip :text="store.theme === 'dark' ? 'Light mode' : 'Dark mode'" location="bottom">
      <template #activator="{ props: tProps }">
        <v-btn v-bind="tProps" icon variant="text" density="comfortable" @click="changeTheme">
          <v-icon size="20">{{ store.theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
        </v-btn>
      </template>
    </v-tooltip>

    <v-divider vertical class="mx-1" />

    <MenuAnonymous v-if="!store.isSignedIn" />
    <MenuUser v-else />

    <div v-if="!store.isSignedIn" class="mr-2">
      <v-btn
        v-for="(account, i) in store.accounts"
        :key="i"
        :to="account.path"
        variant="tonal"
        color="primary"
        size="small"
        class="hidden-sm-and-down ml-2"
      >{{ $t('core.accounts.' + account.name + '.text') }}</v-btn>
    </div>
    <div v-else class="mr-1" />
  </v-app-bar>
</template>

<script setup>

import { useAppStore } from '@/stores/app'
import { useTheme, useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import { uuidToColor } from '@/utils/utils'
import MenuAnonymous from '@/components/menu/MenuAnonymous.vue'
import MenuUser from '@/components/menu/MenuUser.vue'

const store = useAppStore()
const router = useRouter()
const theme = useTheme()
const { mobile } = useDisplay()

function onLogoClick() {
  if (!store.isSignedIn) {
    router.push('/')
    return
  }
  if (store.org.id) {
    router.push('/orgs/' + store.org.id + '/projects')
  } else {
    router.push('/orgs')
  }
}

function onSwitchOrg(org) {
  store.setOrg(org)
  store.clearProject()
  store.clearSprint()
  router.push(`/orgs/${org.id}/projects`)
}

function changeTheme() {
  const currentTheme = store.theme === 'light' ? 'dark' : 'light'
  theme.change(currentTheme)
  store.changeTheme(currentTheme)
}

function changeLanguage() {
  if (store.language === 'en') {
    store.setLanguage('zh');
  }
  else {
    store.setLanguage('en');
  }
  location.reload();
}

</script>

<style scoped>
.ado-app-bar :deep(.v-toolbar__content) {
  padding-inline: 4px;
}
</style>
