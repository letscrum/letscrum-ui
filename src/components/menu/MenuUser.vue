<template>
  <v-menu bottom left offset-y :close-on-content-click="false">
    <template #activator="{ props }">
      <v-btn prepend-icon="mdi-account" v-bind="props">{{ store.user.name }}</v-btn>
    </template>
    <v-card min-width="200">
      <v-list>
        <v-list-item
          prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
          subtitle="Founder of Vuetify"
          title="John Leider"
        >
          <template #append>
            <v-btn rounded color="red" dark>VIP</v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" flat>
        <v-list-subheader>用户中心</v-list-subheader>

        <v-list-item
          v-for="(userMenu, i) in userMenus" :key="i" :to="userMenu.path"
          color="primary"
        >
          <template #prepend>
            <v-icon :icon="userMenu.icon"></v-icon>
          </template>

          <v-list-item-title>{{ userMenu.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="" to="/" @click="signOut">{{ $t('user.userMenus.signOut.text') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup>

import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'

defineProps(['userMenus', 'user'])

const store = useAppStore()
const router = useRouter()


function signOut() {
  store.signOut()
  router.push('/')
}
</script>
