<template>

  <v-btn tile text small style="margin-top: 10px;">
    <v-icon left>
      mdi-plus
    </v-icon>
    Add Member
  </v-btn>
  <v-btn tile text small style="margin-top: 10px;">
    <v-icon left>
      mdi-content-save
    </v-icon>
    Save
  </v-btn>
  <v-btn tile text small style="margin-top: 10px;">
    <v-icon left>
      mdi-undo-variant
    </v-icon>
    Undo
  </v-btn>
  <v-menu offset-y bottom right>
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" tile icon small style="margin-top: 10px;" v-on="on">
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
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" tile icon small style="margin-top: 10px;" v-on="on">
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
</template>

<script setup>

</script>
