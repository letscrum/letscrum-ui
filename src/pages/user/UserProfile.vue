<template>
  <DefaultLayout>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-tabs v-model="tab" color="primary">
              <v-tab value="profile">{{ $t('user.profile.title') }}</v-tab>
              <v-tab value="password">{{ $t('user.password.title') }}</v-tab>
            </v-tabs>

            <v-card-text>
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
        </v-col>
      </v-row>
    </v-container>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import UserProfileForm from '@/components/user/UserProfileForm.vue'
import UserPasswordForm from '@/components/user/UserPasswordForm.vue'
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()
const tab = ref(null)

function onProfileUpdate(data) {
  store.updateUser(data)
}
</script>
