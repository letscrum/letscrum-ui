<template>
  <div>
    <v-fab-transition>
      <v-btn
        :key="'mdi-access-point'"
        :color="'green'"
        fab
        large
        dark
        bottom
        right
        fixed
        @click="isHelpShow = true"
      >
        <v-icon>mdi-help</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog
      v-model="isHelpShow"
      width="600px"
    >
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t('help.title') }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="isHelpShow = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-expansion-panels accordion multiple>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $t('help.q1') }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ $t('help.a1') }}
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $t('help.q2') }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ $t('help.a2') }}
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $t('help.q3') }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              {{ $t('help.a3') }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Help',
  props: ['show'],
  created() {
    this.isHelpShow = this.show;
  },
  data: () => ({
    isHelpShow: false
  }),
  methods: {
  }
};
</script>
