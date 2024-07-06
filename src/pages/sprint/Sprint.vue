<template>
  <DefaultLayout>
    <v-tabs>
      <v-tab to="taskboard">Taskboard</v-tab>
      <v-tab to="backlog">Backlog</v-tab>
      <v-tab to="capacity">Capacity</v-tab>
      <v-divider
        vertical
        inset
        class="mx-2"
      ></v-divider>
      <v-spacer></v-spacer>
      <v-menu offset-y bottom right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" tile icon small style="margin-top: 10px;">
            <v-icon>
              mdi-dots-horizontal
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item dense @click="console.log()">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Add all project members</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item dense @click="console.log()">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-account-arrow-right
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Add all members from last sprint</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-menu offset-y bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" tile icon small style="margin-top: 10px;">
            <v-icon>
              mdi-order-bool-ascending
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item dense>
            <v-list-item-subtitle>Side Panel</v-list-item-subtitle>
          </v-list-item>
          <v-list-item dense @click="workDetail = !workDetail">
            <v-list-item-icon class="mr-2">
              <v-icon>
                mdi-briefcase
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Work details</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-tabs>
    <v-divider></v-divider>
    <router-view />
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

</script>
