<template>
  <v-menu bottom left offset-y :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn variant="text" class="text-none" v-bind="props" rounded="pill">
        <UserAvatar :user-id="store.user.id" :user-name="store.user.name" size="32" class="mr-2" />
        <span class="hidden-sm-and-down">{{ store.user.name }}</span>
        <v-icon icon="mdi-chevron-down" size="small" class="ml-1 hidden-sm-and-down"></v-icon>
      </v-btn>
    </template>
    <v-card min-width="240" rounded="lg" elevation="2">
      <v-list class="pa-2">
        <v-list-item>
          <template #prepend>
             <UserAvatar :user-id="store.user.id" :user-name="store.user.name" />
          </template>
          <v-list-item-title class="font-weight-bold">{{ store.user.name }}</v-list-item-title>
          <v-list-item-subtitle class="text-caption">{{ store.user.email }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav class="pa-2">
        <v-list-item
          v-if="store.user.isSuperAdmin"
          to="/users"
          color="primary"
          rounded="lg"
        >
          <template #prepend>
            <v-icon icon="mdi-account-group" size="small"></v-icon>
          </template>
          <v-list-item-title>{{ $t('user.userMenus.users.text') }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          v-for="(userMenu, i) in store.userMenus" :key="i" :to="userMenu.path"
          color="primary"
          rounded="lg"
        >
          <template #prepend>
            <v-icon :icon="userMenu.icon" size="small"></v-icon>
          </template>

          <v-list-item-title>{{ $t(`user.userMenus.${userMenu.name}.text`) }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <div class="pa-2">
        <v-btn block color="error" variant="tonal" prepend-icon="mdi-logout" size="small" @click="signOut">
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
