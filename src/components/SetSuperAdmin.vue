<template>
  <v-dialog v-model="dialog" max-width="420" persistent>
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card class="ado-border" rounded="md">
        <div class="d-flex align-center px-4 py-3 ado-header-bg ado-border-b">
          <v-icon icon="mdi-shield-account" class="mr-2" color="primary" />
          <span class="text-subtitle-1 font-weight-bold">Super Admin</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="isActive.value = false" />
        </div>

        <v-card-text class="pa-4 text-body-2">
          <p class="mb-2">
            {{ props.user.isSuperAdmin ? 'Remove super admin privileges?' : 'Grant super admin privileges?' }}
          </p>
          <div v-if="props.user.name" class="d-flex align-center pa-2 ado-subtle rounded">
            <v-icon size="small" class="mr-2 text-medium-emphasis">mdi-account-circle-outline</v-icon>
            <div class="d-flex flex-column" style="line-height: 1.2;">
              <span class="font-weight-medium">{{ props.user.name }}</span>
              <span v-if="props.user.email" class="text-caption text-medium-emphasis">{{ props.user.email }}</span>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn variant="text" size="small" @click="isActive.value = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" size="small" @click="OnSetSuperAdmin()">Confirm</v-btn>
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
