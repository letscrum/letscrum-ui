<template>
  <v-alert
    dismissible
    color="green"
    border="left"
    colored-border
    elevation="1"
    :icon="icon ? icon : 'mdi-bulletin-board'"
  >
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  name: 'Notice',
  props: ['message', 'icon'],

  methods: {
  }
};
</script>
