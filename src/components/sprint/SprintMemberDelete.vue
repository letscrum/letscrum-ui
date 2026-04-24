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
          <v-icon icon="mdi-account-remove" class="mr-2" color="error" />
          <span class="text-subtitle-1 font-weight-bold text-error">Remove Sprint Member</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="isActive.value = false" />
        </div>

        <v-card-text class="pa-4">
          <v-alert
            type="error"
            variant="tonal"
            density="compact"
            border="start"
            class="text-body-2 mb-3"
          >
            Are you sure you want to remove this member from the sprint?
          </v-alert>
          <div v-if="props.member.userName" class="d-flex align-center pa-2 ado-subtle rounded">
            <v-icon size="small" class="mr-2 text-medium-emphasis">mdi-account-circle-outline</v-icon>
            <span class="font-weight-medium">{{ props.member.userName }}</span>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn variant="text" size="small" @click="isActive.value = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" size="small" prepend-icon="mdi-account-remove-outline" @click="OnDeleteMember()">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { deleteRemoveSprintMember } from '@/apis/sprint';
const emit = defineEmits(['after'])
const props = defineProps(['member'])

import { ref } from 'vue';
import { useAppStore } from '@/stores/app'
const store = useAppStore()

const dialog = ref(false)

function OnDeleteMember() {
  deleteRemoveSprintMember(store.org.id, store.project.id, store.sprint.id, props.member.userId).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
