<template>
  <v-navigation-drawer
    :rail="rail"
    permanent
    @click="rail = false"
  >
    <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="John Leider"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
      <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const props = defineProps(['menus', 'logoUrl'])

const appStore = useAppStore()

const rail = computed({
  get() {
    return appStore.rail;
  },
  set(val) {
    appStore.setRail(val);
  }
})

function onClick(e, item) {
  e.stopPropagation();
  if (item.to === '/') {
    this.$vuetify.goTo(0);
    return;
  }
  if (item.to || !item.href) return;
  this.$vuetify.goTo(item.href);
}
</script>
