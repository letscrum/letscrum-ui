<template>
  <v-dialog v-model="dialog" max-width="420" persistent>
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card class="ado-border" rounded="md">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon icon="mdi-shield-account" class="mr-2" color="primary" />
          Project Admin
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4 text-body-2">
          {{ props.member.isAdmin ? 'Remove admin privileges?' : 'Grant admin privileges?' }}
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="OnSetAdmin()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { putSetProjectAdmin } from '@/apis/project'
const emit = defineEmits(['after'])
const props = defineProps(['member'])

import { ref } from 'vue';
import { useAppStore } from '@/stores/app'
const store = useAppStore()

const dialog = ref(false)

function OnSetAdmin() {
  putSetProjectAdmin(store.org.id, store.project.id, props.member.userId, !props.member.isAdmin).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
