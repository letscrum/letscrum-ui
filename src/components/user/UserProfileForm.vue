<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submit">
    <v-text-field
      v-model="formData.name"
      :label="$t('user.profile.name')"
      variant="outlined"
      density="comfortable"
      :rules="[v => !!v || 'Name is required']"
      required
      :disabled="isSelf"
      class="mt-2"
    ></v-text-field>

    <v-text-field
      v-model="formData.email"
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
      :loading="loading"
      :disabled="!valid"
      type="submit"
      class="mt-2"
    >
      {{ btnText || $t('user.profile.updateBtn') }}
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { putUpdateUser } from '@/apis/user'
import { useAppStore } from '@/stores/app'

const props = defineProps({
  userId: { type: String, required: true },
  initialName: { type: String, default: '' },
  initialEmail: { type: String, default: '' },
  isSelf: { type: Boolean, default: false },
  btnText: { type: String, default: '' }
})

const emit = defineEmits(['success'])
const store = useAppStore()

const form = ref(null)
const valid = ref(false)
const loading = ref(false)
const formData = reactive({
  name: props.initialName,
  email: props.initialEmail
})

watch(() => props.initialName, (val) => formData.name = val)
watch(() => props.initialEmail, (val) => formData.email = val)

async function submit() {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await putUpdateUser(props.userId, {
      name: formData.name,
      email: formData.email
    })
    if (res.status === 200) {
      store.showGlobalErr(true)
      store.setGlobalErrMessage('Profile updated successfully')
      emit('success', { name: formData.name, email: formData.email })
    }
  } catch (error) {
    store.showGlobalErr(true)
    store.setGlobalErrMessage(error.response?.data?.message || 'Failed to update profile')
  } finally {
    loading.value = false
  }
}
</script>
