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
                  <v-form ref="profileForm" v-model="profileValid" @submit.prevent="updateProfile">
                    <v-text-field
                      v-model="profile.name"
                      :label="$t('user.profile.name')"
                      variant="outlined"
                      density="comfortable"
                      :rules="[v => !!v || 'Name is required']"
                      required
                      disabled
                      class="mt-2"
                    ></v-text-field>

                    <v-text-field
                      v-model="profile.email"
                      :label="$t('user.profile.email')"
                      variant="outlined"
                      density="comfortable"
                      :rules="[
                        v => !!v || 'Email is required',
                        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
                      ]"
                      required
                    ></v-text-field>

                    <v-btn
                      color="primary"
                      :loading="profileLoading"
                      :disabled="!profileValid"
                      type="submit"
                      class="mt-2"
                    >
                      {{ $t('user.profile.updateBtn') }}
                    </v-btn>
                  </v-form>
                </v-window-item>

                <v-window-item value="password">
                  <v-form ref="passwordForm" v-model="passwordValid" @submit.prevent="changePassword">
                    <v-text-field
                      v-model="password.oldPassword"
                      :label="$t('user.password.oldPassword')"
                      variant="outlined"
                      density="comfortable"
                      type="password"
                      :rules="[v => !!v || 'Old password is required']"
                      required
                      class="mt-2"
                    ></v-text-field>

                    <v-text-field
                      v-model="password.newPassword"
                      :label="$t('user.password.newPassword')"
                      variant="outlined"
                      density="comfortable"
                      type="password"
                      :rules="[v => !!v || 'New password is required']"
                      required
                    ></v-text-field>

                    <v-text-field
                      v-model="password.confirmPassword"
                      :label="$t('user.password.confirmPassword')"
                      variant="outlined"
                      density="comfortable"
                      type="password"
                      :rules="[
                        v => !!v || 'Confirm password is required',
                        v => v === password.newPassword || 'Passwords do not match'
                      ]"
                      required
                    ></v-text-field>

                    <v-btn
                      color="primary"
                      :loading="passwordLoading"
                      :disabled="!passwordValid"
                      type="submit"
                      class="mt-2"
                    >
                      {{ $t('user.password.changeBtn') }}
                    </v-btn>
                  </v-form>
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
import { ref, reactive, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { putUpdateUser, putUpdateUserPassword } from '@/apis/user'

const store = useAppStore()
const tab = ref(null)

const profileForm = ref(null)
const profileValid = ref(false)
const profileLoading = ref(false)
const profile = reactive({
  name: '',
  email: ''
})

const passwordForm = ref(null)
const passwordValid = ref(false)
const passwordLoading = ref(false)
const password = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  if (store.user) {
    profile.name = store.user.name
    profile.email = store.user.email
  }
})

async function updateProfile() {
  const { valid } = await profileForm.value.validate()
  if (!valid) return

  profileLoading.value = true
  try {
    const res = await putUpdateUser(store.user.id, {
      name: profile.name,
      email: profile.email
    })
    if (res.status === 200) {
      store.updateUser({
        name: profile.name,
        email: profile.email
      })
      store.showGlobalErr(true)
      store.setGlobalErrMessage('Profile updated successfully')
    }
  } catch (error) {
    store.showGlobalErr(true)
    store.setGlobalErrMessage(error.response?.data?.message || 'Failed to update profile')
  } finally {
    profileLoading.value = false
  }
}

async function changePassword() {
  const { valid } = await passwordForm.value.validate()
  if (!valid) return

  passwordLoading.value = true
  try {
    const res = await putUpdateUserPassword(store.user.id, {
      oldPassword: password.oldPassword,
      newPassword: password.newPassword
    })
    if (res.status === 200) {
      store.showGlobalErr(true)
      store.setGlobalErrMessage('Password changed successfully')
      passwordForm.value.reset()
    }
  } catch (error) {
    store.showGlobalErr(true)
    store.setGlobalErrMessage(error.response?.data?.message || 'Failed to change password')
  } finally {
    passwordLoading.value = false
  }
}
</script>
