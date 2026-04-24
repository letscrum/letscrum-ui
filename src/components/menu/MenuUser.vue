<template>
  <v-menu location="bottom end" offset="4" :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn
        variant="text"
        density="comfortable"
        class="text-none mx-1"
        v-bind="props"
        :ripple="false"
        height="36"
      >
        <UserAvatar :user-id="store.user.id" :user-name="store.user.name" size="26" class="mr-2" />
        <span class="hidden-sm-and-down text-body-2 font-weight-medium">{{ store.user.name }}</span>
        <v-icon size="x-small" class="ml-1 hidden-sm-and-down">mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-card min-width="260" max-width="300" class="ado-border" rounded="md">
      <!-- User header -->
      <div class="d-flex align-center pa-3" style="gap: 12px;">
        <UserAvatar :user-id="store.user.id" :user-name="store.user.name" size="40" />
        <div style="min-width: 0;">
          <div class="text-body-2 font-weight-bold text-truncate">{{ store.user.name }}</div>
          <div class="text-caption text-medium-emphasis text-truncate">{{ store.user.email || 'No email' }}</div>
        </div>
      </div>

      <v-divider />

      <v-list density="compact" nav class="pa-1">
        <v-list-item
          v-if="store.user.isSuperAdmin"
          to="/users"
          prepend-icon="mdi-account-group-outline"
          rounded="sm"
        >
          <v-list-item-title class="text-body-2">{{ $t('user.userMenus.users.text') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="(userMenu, i) in store.userMenus"
          :key="i"
          :to="userMenu.path"
          :prepend-icon="userMenu.icon"
          rounded="sm"
        >
          <v-list-item-title class="text-body-2">{{ $t(`user.userMenus.${userMenu.name}.text`) }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider />

      <div class="pa-2">
        <v-btn
          block
          color="error"
          variant="tonal"
          prepend-icon="mdi-logout"
          size="small"
          @click="signOut"
        >
          {{ $t('user.userMenus.signOut.text') }}
        </v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import UserAvatar from '@/components/user/UserAvatar.vue'

const store = useAppStore()
const router = useRouter()

function signOut() {
  store.signOut()
  router.push('/')
}
</script>
