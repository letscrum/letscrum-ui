<template>
  <v-card outlined>
    <v-toolbar flat>
      <v-toolbar-title>Login form</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon v-if="isDialog != undefined" @click="$emit('close-dialog')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          label="Username"
          name="name"
          prepend-icon="mdi-email"
          type="text"
          v-model="name"
          required
        />
        <v-text-field
          id="password"
          label="Password"
          v-model="password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn block :loading="loading" @click="SingIn()">{{
        $t("signIn.signInBtn")
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { postSignIn } from '@/apis/index'
import axios from 'axios'

defineProps(['isDialog'])

const store = useAppStore()
const router = useRouter()
const name = ref('admin')
const password = ref('admin')

const loading = ref(false)

function SingIn() {
  loading.value = true
  postSignIn({
    name: name.value,
    password: password.value
  }).then((res) => {
    if (res.status === 200) {
      axios.defaults.headers.Authorization = `Bearer ${res.data.item.token.accessToken}`
      store.signIn({
        id: res.data.item.id,
        name: res.data.item.name,
        email: res.data.item.email,
        isSuperAdmin: res.data.item.isSuperAdmin,
        accessToken: res.data.item.token.accessToken,
        refreshToken: res.data.item.token.refreshToken
      });
      router.push({ path: '/projects' })
      loading.value = false
    }
  }).catch(() => {
    loading.value = false
  })
}
</script>
