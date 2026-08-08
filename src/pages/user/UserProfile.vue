<template>
  <DefaultLayout>
    <template #subheader>
      <div class="ado-subheader">
        <UserAvatar
          v-if="store.user"
          :user-id="store.user.id"
          :user-name="store.user.name"
          size="32"
          class="mr-3"
        />
        <div class="d-flex flex-column" style="line-height: 1.2; min-width: 0;">
          <span class="ado-subheader__title text-truncate">{{ store.user?.name || 'Profile' }}</span>
          <span class="text-caption text-medium-emphasis text-truncate">{{ store.user?.email }}</span>
        </div>
      </div>
      <div class="ado-subheader ado-tabs-bar">
        <v-tabs v-model="tab" height="40" color="primary" density="compact">
          <v-tab value="profile">
            <template #prepend><v-icon size="small">mdi-account-circle-outline</v-icon></template>
            {{ $t('user.profile.title') }}
          </v-tab>
          <v-tab value="password">
            <template #prepend><v-icon size="small">mdi-lock-outline</v-icon></template>
            {{ $t('user.password.title') }}
          </v-tab>
        </v-tabs>
      </div>
    </template>

    <div class="ado-page">
      <v-card max-width="640" class="ado-panel mx-auto">
        <v-card-text class="pa-5">
          <v-window v-model="tab">
            <v-window-item value="profile">
              <UserProfileForm
                v-if="store.user"
                :user-id="store.user.id"
                :initial-name="store.user.name"
                :initial-email="store.user.email"
                :is-self="true"
                @success="onProfileUpdate"
              />
            </v-window-item>

            <v-window-item value="password">
              <UserPasswordForm
                v-if="store.user"
                :user-id="store.user.id"
                :is-self="true"
              />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import UserProfileForm from '@/components/user/UserProfileForm.vue'
import UserPasswordForm from '@/components/user/UserPasswordForm.vue'
import UserAvatar from '@/components/user/UserAvatar.vue'
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const tab = ref('profile')

function onProfileUpdate(data) {
  store.updateUser(data)
}
</script>
