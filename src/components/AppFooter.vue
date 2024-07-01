<template>
  <v-footer padless absolute>
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="(link, i) in links"
        :key="i"
        text=""
        rounded
        class="my-2"
        :to="link.path"
      >{{ $t('core.links.' + link.name) }}</v-btn>
      <v-col class="lighten-2 py-4 text-center" cols="12">
        <v-btn text="" rounded>{{ $t('core.toLanguage') }}</v-btn>
        <v-btn icon>
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
        <v-btn text="" disabled>
          {{ new Date().getFullYear() }} —
          <strong>letscrum-vue</strong>
        </v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
defineProps(['links', 'dark', 'language'])
</script>
