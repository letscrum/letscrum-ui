<template>
  <v-app-bar app dense flat>
    <v-img
      :src="appStore.logoUrl"
      contain
      class="mr-5"
      width="110"
      max-width="110"
    />
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn
        text
        v-for="(menu, i) in appStore.menus"
        :key="i"
        :to="menu.path"
      >{{ $t('core.menus.' + menu.name + '.text') }}</v-btn>
    </v-toolbar-items>
    <v-breadcrumbs :items="appStore.breadcrumbs">
      <template v-slot:item="{ item }">
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
    <Account :accounts="appStore.accounts" v-if="!appStore.isSignedIn"></Account>
    <Menu :userMenus="appStore.userMenus" :user="appStore.user" v-else></Menu>
    <div v-if="!appStore.isSignedIn">
      <v-btn
        v-for="(account, i) in appStore.accounts"
        :key="i"
        :to="account.path"
        depressed
        class="hidden-sm-and-down ml-2"
      >{{ $t('core.accounts.' + account.name + '.text') }}</v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>

import { useAppStore } from '@/stores/app'
defineProps(['menus', 'logoUrl', 'accounts', 'userMenus', 'user', 'theme', 'language'])

const appStore = useAppStore()
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()


function changeTheme() {
  vuetifyTheme.global.name.value = appStore.theme === 'light' ? 'dark' : 'light'
  appStore.changeTheme(vuetifyTheme.global.name.value)
}

function changeLanguage() {
  if (appStore.language === 'cn') {
    appStore.setLanguage('en');
  }
  else {
    appStore.setLanguage('cn');
  }
  location.reload();
}


</script>
