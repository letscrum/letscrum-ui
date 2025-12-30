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

    <v-card rounded="lg" elevation="2">
      <v-card-title class="d-flex align-center pa-4">
        <v-icon icon="mdi-account-edit" class="mr-2" color="primary"></v-icon>
        {{ $t('user.edit.title') }}
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" density="comfortable" @click="dialog = false"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-tabs v-model="tab" color="primary">
        <v-tab value="profile">{{ $t('user.profile.title') }}</v-tab>
        <v-tab value="password">{{ $t('user.password.title') }}</v-tab>
      </v-tabs>

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

const props = defineProps({
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
