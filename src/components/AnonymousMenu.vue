<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on }">
      <v-btn class="hidden-md-and-up" icon v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(account, i) in accounts" :key="i" :to="account.path">
        <v-list-item-title align="right">
          {{ $t('core.accounts.' + account.name + '.text') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
// Utilities
export default {
  name: 'UserMenu',
  data: () => ({}),
  props: ['accounts'],
  components: {},
  computed: {},
  methods: {}
};
</script>
