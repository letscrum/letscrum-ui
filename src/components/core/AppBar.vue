<template>
  <v-app-bar scroll-behavior="elevate">
    <v-app-bar-nav-icon v-if="mobile" @click="store.setDrawer(!store.drawer)"></v-app-bar-nav-icon>
    <v-img
      :src="store.logoUrl"
      contain
      class="ml-3 mr-1"
      width="150"
      max-width="150"
      @click="store.org.id ? router.push('/orgs/' + store.org.id + '/projects') : router.push('/orgs')"
    />
    <v-toolbar-items v-if="!mobile">
      <v-breadcrumbs :items="route.meta.breadcrumbs">
        <template #item="{ item }">
          <v-btn variant="plain" :to="mergeParams(item.to)" :ripple="false" :readonly="item.to.name == route.name">
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
    <MenuAnonymous v-if="!store.isSignedIn"></MenuAnonymous>
    <MenuUser v-else></MenuUser>
    <div v-if="!store.isSignedIn" class="mr-1">
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

const store = useAppStore()
import { useTheme, useDisplay } from 'vuetify'

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

const theme = useTheme()
const { mobile } = useDisplay()

function mergeParams(to) {
  if (typeof to === 'object' && to.name) {
    return {
      ...to,
      params: { ...route.params, ...to.params }
    }
  }
  return to
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
