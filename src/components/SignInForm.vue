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
          label="Email Address"
          name="email"
          prepend-icon="mdi-email"
          type="text"
          required
        />
        <v-text-field
          id="password"
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

defineProps(['isDialog'])

const store = useAppStore()
const router = useRouter()

function SingIn() {
  store.signIn({
    id: 1,
    name: 'John Doe',
    email: 'whfill@163.com',
    isSuperAdmin: true,
    accessToken: 'token',
    refreshToken: 'refreshToken',
  })
  router.push({ path: '/projects' })
}
</script>
