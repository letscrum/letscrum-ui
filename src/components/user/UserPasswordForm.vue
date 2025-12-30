<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submit">
    <v-text-field
      v-if="isSelf"
      v-model="formData.oldPassword"
      :label="$t('user.password.oldPassword')"
      variant="outlined"
      density="comfortable"
      type="password"
      :rules="[v => !!v || 'Old password is required']"
      required
      class="mt-2"
    ></v-text-field>

    <v-text-field
      v-model="formData.newPassword"
      :label="isSelf ? $t('user.password.newPassword') : $t('user.create.password')"
      variant="outlined"
      density="comfortable"
      type="password"
      :rules="[v => !!v || 'New password is required']"
      required
      :class="isSelf ? '' : 'mt-2'"
    ></v-text-field>

    <v-text-field
      v-model="formData.confirmPassword"
      :label="isSelf ? $t('user.password.confirmPassword') : $t('user.create.confirmPassword')"
      variant="outlined"
      density="comfortable"
      type="password"
      :rules="[
        v => !!v || 'Confirm password is required',
        v => v === formData.newPassword || 'Passwords do not match'
      ]"
      required
    ></v-text-field>

    <v-btn
      color="primary"
      :loading="loading"
      :disabled="!valid"
      type="submit"
      class="mt-2"
    >
      {{ btnText || $t('user.password.changeBtn') }}
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { putUpdateUserPassword, putResetPassword } from '@/apis/user'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  userId: { type: String, required: true },
  isSelf: { type: Boolean, default: false },
  btnText: { type: String, default: '' }
})

const emit = defineEmits(['success'])
const store = useAppStore()

const form = ref(null)
const valid = ref(false)
const loading = ref(false)
const formData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

async function submit() {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    let res;
    if (props.isSelf) {
      res = await putUpdateUserPassword(props.userId, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })
    } else {
      res = await putResetPassword(props.userId, {
        password: formData.newPassword
      })
    }

    if (res.status === 200) {
      store.showGlobalErr(true)
      store.setGlobalErrMessage('Password changed successfully')
      form.value.reset()
      emit('success')
    }
  } catch (error) {
    store.showGlobalErr(true)
    store.setGlobalErrMessage(error.response?.data?.message || 'Failed to change password')
  } finally {
    loading.value = false
  }
}
</script>
