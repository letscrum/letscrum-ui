<template>
  <v-dialog
    v-model="dialog"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <v-sheet max-width="200px">
        <v-sparkline
          v-bind="activatorProps"
          fill
          :gradient="['rgb(0,120,212)']"
          line-width="0"
          :model-value="value"
          padding="0"
          :smooth="false"
          auto-draw
        ></v-sparkline>
      </v-sheet>
    </template>

    <template #default="{ isActive }">
      <v-card
        prepend-icon="mdi-earth"
        title="Select Country"
      >
        <v-divider class="my-1"></v-divider>

        <v-card-text class="px-4">
          <v-sparkline
          fill
          :gradient="['rgb(0,120,212)']"
          line-width="0"
          :model-value="value"
          padding="4"
          height="120"
          :smooth="false"
          :labels="labels"
          label-size="4"
          auto-draw
        ></v-sparkline>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text="Close"
            @click="isActive.value = false"
          ></v-btn>

        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const dialog = ref(false)
const labels = ref([
        '12am',
        '3am',
        '6am',
        '9am',
        '12pm',
        '3pm',
        '6pm',
        '9pm',
      ])
const value = ([
        200,
        675,
        410,
        390,
        310,
        460,
        250,
        240,
      ])

</script>
