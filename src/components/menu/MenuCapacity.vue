<template>
  <v-btn style="margin-top: 6px;" prepend-icon="mdi-plus" variant="text">
    Add Member
  </v-btn>
  <v-btn style="margin-top: 6px;" prepend-icon="mdi-content-save" variant="text">
    Save
  </v-btn>
  <v-btn style="margin-top: 6px;" prepend-icon="mdi-undo-variant" variant="text">
    Undo
  </v-btn>
  <v-menu bottom left offset-y>
    <template #activator="{ props }">
      <v-btn style="margin-top: 6px;" v-bind="props" density="comfortable" icon="mdi-dots-horizontal" variant="text">
      </v-btn>
    </template>
    <v-list density="compact">
      <v-list-item>
        <v-list-item-title>Add all project members</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Copy from last sprint</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>

</script>
