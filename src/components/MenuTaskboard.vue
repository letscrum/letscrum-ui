<template>
  <v-spacer></v-spacer>
  <v-menu bottom left offset-y :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" density="comfortable">
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
  <v-menu bottom left offset-y :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-order-bool-ascending" variant="text" density="comfortable">
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-subheader>用户中心</v-list-subheader>

      <v-list-item @click="workDetail = !workDetail">

        <v-list-item-title>Work details</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>

</script>
