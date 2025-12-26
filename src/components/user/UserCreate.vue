<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div class="d-inline-block" v-bind="activatorProps">
        <slot></slot>
      </div>
    </template>

    <v-card rounded="lg" elevation="2">
      <v-card-title class="d-flex align-center pa-4">
        <v-icon icon="mdi-account-plus" class="mr-2" color="primary"></v-icon>
        {{ $t('user.create.title') }}
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <v-form ref="form" @submit.prevent="createUser">
          <v-text-field
            v-model="user.name"
            :label="$t('user.create.name')"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[v => !!v || $t('user.create.rules.required')]"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.email"
            :label="$t('user.create.email')"
            variant="outlined"
            density="compact"
            class="mb-2"
            :rules="[
              v => !!v || $t('user.create.rules.required'),
              v => /.+@.+\..+/.test(v) || $t('user.create.rules.email')
            ]"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.password"
            :label="$t('user.create.password')"
            variant="outlined"
            density="compact"
            type="password"
            class="mb-2"
            :rules="[v => !!v || $t('user.create.rules.required')]"
            required
          ></v-text-field>

          <v-text-field
            v-model="user.confirmPassword"
            :label="$t('user.create.confirmPassword')"
            variant="outlined"
            density="compact"
            type="password"
            :rules="[
              v => !!v || $t('user.create.rules.required'),
              v => v === user.password || $t('user.create.rules.match')
            ]"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="dialog = false"
        >
          {{ $t('user.create.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          :loading="loading"
          @click="createUser()"
        >
          {{ $t('user.create.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { postCreateUser } from '@/apis/user';

const emit = defineEmits(['after-create']);

const dialog = ref(false);
const loading = ref(false);
const form = ref(null);
const user = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

async function createUser() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  loading.value = true;

  postCreateUser({
    name: user.value.name,
    email: user.value.email,
    password: user.value.password
  }).then((res) => {
    if (res.status === 200) {
      dialog.value = false;
      user.value = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      };
      emit('after-create');
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}
</script>
