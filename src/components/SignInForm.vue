<template>
  <v-card class="ado-border" elevation="2" rounded="md">
    <div class="px-5 pt-5 pb-2">
      <div class="text-h6 font-weight-bold mb-1">{{ $t('signIn.formTitle') || 'Sign in' }}</div>
      <div class="text-caption text-medium-emphasis">Use your Letscrum account to continue.</div>
    </div>
    <v-card-text class="px-5 pt-2">
      <v-form ref="form" v-model="valid" @submit.prevent="signIn">
        <v-text-field
          v-model="name"
          :rules="nameRules"
          :label="$t('signIn.emailLabel') || 'Username'"
          name="name"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          density="comfortable"
          class="mb-3"
          autocomplete="username"
          required
          @keyup.enter="signIn"
        />
        <v-text-field
          id="password"
          v-model="password"
          :rules="passwordRules"
          :label="$t('signIn.passwordLabel') || 'Password'"
          name="password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          autocomplete="current-password"
          required
          @click:append-inner="showPassword = !showPassword"
          @keyup.enter="signIn"
        />
      </v-form>
    </v-card-text>
    <v-card-actions class="px-5 pb-5 pt-0">
      <v-btn
        block
        size="large"
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="!valid"
        @click="signIn"
      >
        {{ $t("signIn.signInBtn") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { postSignIn } from '@/apis/index'
import { getGetOrgs, getGetOrg } from '@/apis/org'
import axios from 'axios'

const store = useAppStore()
const router = useRouter()
const form = ref(null)
const valid = ref(false)
const name = ref('admin')
const password = ref('admin')
const loading = ref(false)
const showPassword = ref(false)

const nameRules = [
  v => !!v || 'Name is required',
]
const passwordRules = [
  v => !!v || 'Password is required',
]

async function signIn() {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  try {
    const res = await postSignIn({
      name: name.value,
      password: password.value
    })

    if (res.status === 200) {
      axios.defaults.headers.Authorization = `Bearer ${res.data.item.token.accessToken}`
      store.signIn({
        id: res.data.item.id,
        name: res.data.item.name,
        email: res.data.item.email,
        isSuperAdmin: res.data.item.isSuperAdmin,
        accessToken: res.data.item.token.accessToken,
        refreshToken: res.data.item.token.refreshToken
      })

      const orgsRes = await getGetOrgs()
      if (orgsRes.status === 200 && orgsRes.data.items && orgsRes.data.items.length > 0) {
        store.setOrgs(orgsRes.data.items.map((item) => ({
          id: item.id,
          name: item.name,
          displayName: item.displayName,
          description: item.description,
          myRole: item.myRole
        })))

        const firstOrgId = orgsRes.data.items[0].id
        try {
          const orgRes = await getGetOrg(firstOrgId)
          if (orgRes.status === 200) {
            store.setOrg(orgRes.data.item)
            router.push(orgRes.data.item.id ? `/orgs/${orgRes.data.item.id}/projects` : '/orgs')
          } else {
            router.push('/orgs')
          }
        } catch {
          router.push('/orgs')
        }
      } else {
        router.push('/orgs')
      }
    }
  } catch (error) {
    store.showGlobalErr(true)
    store.setGlobalErrMessage(error.response?.data?.message || 'Sign in failed')
  } finally {
    loading.value = false
  }
}
</script>
