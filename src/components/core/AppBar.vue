<template>
  <v-app-bar app dense flat>
    <v-img
      :src="logoUrl"
      contain
      class="mr-5"
      width="110"
      max-width="110"
    />
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn>TEST</v-btn>
    </v-toolbar-items>
    <v-breadcrumbs :items="breadcrumbs">
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
    <v-btn text="" rounded>TEST</v-btn>
    <v-btn icon>
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
    <v-divider
      vertical
      inset
      class="mx-1"
    ></v-divider>
    <Account />
    <Menu></Menu>
    <div>
      <v-btn
        v-for="(account, i) in accounts"
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

const app = useAppStore()

</script>
