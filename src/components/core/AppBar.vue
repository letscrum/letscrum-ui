<template>
  <v-app-bar scroll-behavior="elevate">
    <v-app-bar-nav-icon class="hidden-md-and-up" @click="store.setDrawer(!store.drawer)"></v-app-bar-nav-icon>
    <v-img
      :src="store.logoUrl"
      contain
      class="ml-3 mr-1"
      width="150"
      max-width="150"
      @click="router.push('/orgs/' + store.org.id + '/projects')"
    />
    <v-toolbar-items class="hidden-sm-and-down">
      <v-breadcrumbs :items="route.meta.breadcrumbs">
        <template #item="{ item }">
          <v-btn variant="plain" :to="item.to" :ripple="false" :readonly="item.to.name == route.name">
            {{ item.title }}
          </v-btn>
        </template>
      </v-breadcrumbs>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-btn text="" rounded @click="changeLanguage">{{ $t('core.toLanguage') }}</v-btn>
    <v-btn icon @click="changeTheme">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-divider
      vertical
      inset
      class="mx-1"
    ></v-divider>
    <MenuAnonymous v-if="!store.isSignedIn" :accounts="store.accounts"></MenuAnonymous>
    <MenuUser v-else :user-menus="store.userMenus" :user="store.user"></MenuUser>
    <div v-if="!store.isSignedIn">
      <v-btn
        v-for="(account, i) in store.accounts"
        :key="i"
        :to="account.path"
        depressed
        class="hidden-sm-and-down ml-2"
      >{{ $t('core.accounts.' + account.name + '.text') }}</v-btn>
    </div>
  </v-app-bar>
  <v-divider></v-divider>
</template>

<script setup>

import { useAppStore } from '@/stores/app'
defineProps(['menus', 'logoUrl', 'accounts', 'userMenus', 'user'])

const store = useAppStore()
import { useTheme } from 'vuetify'

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const theme = useTheme()

function changeTheme() {
  theme.global.name.value = store.theme === 'light' ? 'dark' : 'light'
  store.changeTheme(theme.global.name.value)
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
