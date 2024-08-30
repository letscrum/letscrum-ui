<template>
  <v-dialog
    v-model="dialog"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpenCreate()">
        <v-sheet
          max-width="200px"
        >
          <v-sparkline
            max-width="200"
            :labels="labels"
            :model-value="value"
            line-width="1"
            padding="16"
          ></v-sparkline>
        </v-sheet>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card
        prepend-icon="mdi-earth"
        title="Select Country"
      >
        <v-divider class="my-1"></v-divider>

        <v-card-text class="px-4">
          <v-sparkline
            max-width="200"
            :labels="labels"
            :model-value="value"
            line-width="1"
            padding="16"
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
