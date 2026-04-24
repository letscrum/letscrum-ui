<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div class="d-inline-block" v-bind="activatorProps">
        <slot></slot>
      </div>
    </template>

    <v-card class="ado-border" rounded="md">
      <div class="d-flex align-center px-4 py-3 ado-header-bg ado-border-b">
        <v-icon icon="mdi-account-edit" class="mr-2" color="primary"></v-icon>
        <span class="text-subtitle-1 font-weight-bold">{{ $t('user.edit.title') }}</span>
        <span v-if="user.name" class="text-body-2 text-medium-emphasis ml-2">· {{ user.name }}</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="dialog = false"></v-btn>
      </div>

      <v-tabs v-model="tab" color="primary" density="compact" height="40">
        <v-tab value="profile">
          <template #prepend><v-icon size="small">mdi-account-circle-outline</v-icon></template>
          {{ $t('user.profile.title') }}
        </v-tab>
        <v-tab value="password">
          <template #prepend><v-icon size="small">mdi-lock-outline</v-icon></template>
          {{ $t('user.password.title') }}
        </v-tab>
      </v-tabs>
      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-window v-model="tab">
          <v-window-item value="profile">
            <UserProfileForm
              :user-id="user.id"
              :initial-name="user.name"
              :initial-email="user.email"
              :btn-text="$t('user.edit.confirm')"
              @success="onSuccess"
            />
          </v-window-item>

          <v-window-item value="password">
            <UserPasswordForm
              :user-id="user.id"
              :is-self="false"
              :btn-text="$t('user.password.changeBtn')"
              @success="onSuccess"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import UserProfileForm from '@/components/user/UserProfileForm.vue'
import UserPasswordForm from '@/components/user/UserPasswordForm.vue'

defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['after-update']);

const dialog = ref(false);
const tab = ref(null);

function onSuccess() {
  emit('after-update');
  dialog.value = false;
}
</script>
