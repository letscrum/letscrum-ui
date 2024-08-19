<template>
  <v-dialog
    v-model="dialog"
    width="50%"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps" @click="onOpenOrg()">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card
        prepend-icon="mdi-earth"
        title="Select Country"
        height="50vh"
      >
        <v-divider class="my-1"></v-divider>

        <v-card-text class="px-4">
          <v-text-field v-model="org.name" label="Label"></v-text-field>

          <v-text-field v-model="org.displayName" label="Label"></v-text-field>

          <v-textarea v-model="org.description" label="Label"></v-textarea>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn
            text="Close"
            @click="isActive.value = false"
          ></v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="surface-variant"
            text="Save"
            variant="flat"
            @click="createOrg()"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>

import { ref } from 'vue';

import { postCreateOrg, getGetOrgs } from '@/apis/org';
import { useAppStore } from '@/stores/app';

const org = ref({})
const dialog = ref(false)
const store = useAppStore()

function onOpenOrg() {
  org.value = {}
  dialog.value = true
}

function createOrg() {
  console.log(org.value)
  postCreateOrg({
    name: org.value.name,
    displayName: org.value.displayName,
    description: org.value.description,
  }).then((res) => {
    console.log(res)
    if (res.status === 200) {
      getGetOrgs().then((res) => {
        if (res.status === 200) {
          store.setOrgs(res.data.items)
          dialog.value = false
        }
      })
    }
  })
}

</script>
