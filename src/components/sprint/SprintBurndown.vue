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
          :model-value="props.burndownData.values"
          padding="0"
          :smooth="false"
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
          :model-value="props.burndownData.values"
          padding="4"
          height="120"
          :smooth="false"
          :labels="props.burndownData.labels"
          label-size="2"
        ></v-sparkline>
        {{ props.burndownData }}
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
const props = defineProps(['burndownData'])

const dialog = ref(false)

</script>
