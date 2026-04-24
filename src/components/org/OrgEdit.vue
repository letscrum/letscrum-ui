<template>
  <v-dialog
    v-model="dialog"
    width="500"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div class="d-inline-block" v-bind="activatorProps" @click="onOpenEdit">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card class="ado-border" rounded="md">
        <v-progress-linear v-if="loading" indeterminate color="primary" absolute top></v-progress-linear>
        <div class="d-flex align-center px-4 py-3 ado-header-bg ado-border-b">
          <v-icon icon="mdi-pencil" class="mr-2" color="primary"></v-icon>
          <span class="text-subtitle-1 font-weight-bold">{{ $t('org.edit.title') }}</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="isActive.value = false" />
        </div>

        <v-card-text class="pa-4">
          <v-form ref="form" @submit.prevent="updateOrg">
            <v-text-field
              v-model="org.displayName"
              :label="$t('org.edit.displayName')"
              variant="outlined"
              density="compact"
              hint="Human-friendly name shown in the UI."
              persistent-hint
              autofocus
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="org.description"
              :label="$t('org.edit.description')"
              variant="outlined"
              density="compact"
              rows="3"
              auto-grow
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            size="small"
            @click="isActive.value = false"
          >
            {{ $t('org.edit.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            size="small"
            :loading="loading"
            @click="updateOrg()"
          >
            {{ $t('org.edit.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { putUpdateOrg, getGetOrg } from '@/apis/org';

const emit = defineEmits(['after-update']);
const props = defineProps(['orgId']);

const org = ref({});
const dialog = ref(false);
const loading = ref(false);

function onOpenEdit() {
  loading.value = true;
  getGetOrg(props.orgId).then((res) => {
    if (res.status === 200) {
      org.value = res.data.item;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function updateOrg() {
  loading.value = true;
  putUpdateOrg(props.orgId, {
    displayName: org.value.displayName,
    description: org.value.description
  }).then((res) => {
    if (res.status === 200) {
      emit('after-update');
      dialog.value = false;
    }
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}
</script>
