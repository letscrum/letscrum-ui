<template>
  <v-navigation-drawer permanent app>
    <v-list-item class="px-2">
        <v-list-item-avatar color="blue">
          <span class="white--text text-h5">
            test
          </span>
        </v-list-item-avatar>
        <v-list-item-title>test</v-list-item-title>
        <v-btn icon>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Overview</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sprints</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Backlogs</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Work items</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  //
</script>
