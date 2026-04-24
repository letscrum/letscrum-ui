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
          Super Admin
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4 text-body-2">
          {{ props.user.isSuperAdmin ? 'Remove super admin privileges?' : 'Grant super admin privileges?' }}
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="isActive.value = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="OnSetSuperAdmin()">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { putSetSuperAdmin } from '@/apis/user'
const emit = defineEmits(['after'])
const props = defineProps(['user'])

import { ref } from 'vue';

const dialog = ref(false)

function OnSetSuperAdmin() {
  putSetSuperAdmin(props.user.id, !props.user.isSuperAdmin).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
