<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" >
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar color="grey">
            <v-icon dark>mdi-account-circle</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn rounded color="red" dark>VIP</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list flat>
        <v-list-item to="/user">
          <v-list-item-title>{{ $t('user.userMenus.text') }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(userMenu, i) in userMenus" :key="i" :to="userMenu.path">
            <v-list-item-icon>
              <v-icon></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('user.userMenus.' + userMenu.name + '.text') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="" @click="signOut" to="/">{{ $t('user.userMenus.signOut.text') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script>

// Utilities
export default {
  name: 'UserMenu',
  data: () => ({}),
  props: ['userMenus', 'user'],
  components: {},
  computed: {
  },
  methods: {
    signOut() {
      this.$store.commit('signOut');
      this.$router.push('/');
    }
  }
};
</script>
