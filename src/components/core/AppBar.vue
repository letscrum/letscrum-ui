<template>
  <v-app-bar scroll-behavior="elevate">
    <v-img
      :src="store.logoUrl"
      contain
      class="mr-5"
      width="110"
      max-width="110"
    />
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        v-for="(menu, i) in store.menus"
        :key="i"
        text
        :to="menu.path"
      >{{ $t('core.menus.' + menu.name + '.text') }}</v-btn>
    </v-toolbar-items>
    <v-breadcrumbs :items="store.breadcrumbs">
      <template #item="{ item }">
        <v-breadcrumbs-item>
          <v-btn plain small tile :to="item.href" :disabled="item.disabled">
            {{ item.text.toUpperCase() }}
          </v-btn>
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
    <v-spacer></v-spacer>
    <!-- <v-text-field
      hide-details
      single-line
      dense
      placeholder="Search"
      append-outer-icon="mdi-magnify"
      @click:append-outer="{}"
      class="mr-2"
    ></v-text-field>
    <v-divider
      vertical
      inset
      class="mx-1"
    ></v-divider> -->
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

const theme = useTheme()


function changeTheme() {
  theme.global.name.value = store.theme === 'light' ? 'dark' : 'light'
  store.changeTheme(theme.global.name.value)
}

function changeLanguage() {
  if (store.language === 'zh') {
    store.setLanguage('en');
  }
  else {
    store.setLanguage('zh');
  }
  location.reload();
}


</script>
