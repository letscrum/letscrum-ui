<template>
  <v-card outlined>
    <v-toolbar flat>
      <v-toolbar-title>{{ $t('signIn.formTitle') }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="name"
          :label="$t('signIn.emailLabel')"
          name="name"
          prepend-icon="mdi-email"
          type="text"
          required
        />
        <v-text-field
          id="password"
          v-model="password"
          :label="$t('signIn.passwordLabel')"
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
import { getGetOrgs, getGetOrg } from '@/apis/org'
import axios from 'axios'

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
      getGetOrgs().then((res) => {
        if (res.status === 200) {
          if (res.data.items && res.data.items.length > 0) {
            store.setOrgs(res.data.items.map((item) => {
              return {
                id: item.id,
                name: item.name,
                displayName: item.displayName,
                description: item.description,
                myRole: item.myRole
              }
            }))
            getGetOrg(res.data.items[0].id).then((res) => {
              if (res.status === 200) {
                store.setOrg(res.data.item)
                if (res.data.item.id) {
                  router.push('/orgs/' + res.data.item.id + '/projects')
                } else {
                  router.push('/orgs')
                }
              } else {
                router.push('/orgs')
              }
            })
          } else {
            router.push('/orgs')
          }
        } else {
          router.push('/orgs')
        }
      })
      loading.value = false
    }
  }).catch(() => {
    loading.value = false
  })
}
</script>
