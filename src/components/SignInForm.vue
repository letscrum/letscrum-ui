<template>
  <v-card outlined>
    <v-toolbar flat>
      <v-toolbar-title>Login form</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="props.isDialog != undefined" icon @click="OnClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="name"
          label="Username"
          name="name"
          prepend-icon="mdi-email"
          type="text"
          required
        />
        <v-text-field
          id="password"
          v-model="password"
          label="Password"
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

const props = defineProps(['isDialog'])

defineEmits(['close-dialog'])

const store = useAppStore()
const router = useRouter()
const name = ref('admin')
const password = ref('admin')

const loading = ref(false)

function OnClose() {

  emit('close-dialog')
}

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
      router.push({ path: '/orgs' })
      loading.value = false
    }
  }).catch(() => {
    loading.value = false
  })
}
</script>
