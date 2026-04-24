<template>
  <v-dialog v-model="dialog" max-width="420" persistent>
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps">
        <slot></slot>
      </div>
    </template>

    <template #default="{ isActive }">
      <v-card class="ado-border" rounded="md">
        <div class="d-flex align-center px-4 py-3 ado-header-bg ado-border-b">
          <v-icon icon="mdi-shield-account" class="mr-2" color="primary" />
          <span class="text-subtitle-1 font-weight-bold">{{ $t('org.member.setAdmin.title') }}</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" density="compact" size="small" @click="isActive.value = false" />
        </div>

        <v-card-text class="pa-4 text-body-2">
          <p class="mb-2">
            {{ props.member.isAdmin ? $t('org.member.setAdmin.remove') : $t('org.member.setAdmin.set') }}
          </p>
          <div v-if="memberName" class="d-flex align-center pa-2 ado-subtle rounded">
            <v-icon size="small" class="mr-2 text-medium-emphasis">mdi-account-circle-outline</v-icon>
            <span class="font-weight-medium">{{ memberName }}</span>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-3">
          <v-spacer />
          <v-btn variant="text" size="small" @click="isActive.value = false">
            {{ $t('org.member.setAdmin.cancel') }}
          </v-btn>
          <v-btn color="primary" variant="flat" size="small" @click="OnSetAdmin()">
            {{ $t('org.member.setAdmin.confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { putSetOrgAdmin } from '@/apis/org'
import { useAppStore } from '@/stores/app'

const emit = defineEmits(['after'])
const props = defineProps(['member'])
const store = useAppStore()

const dialog = ref(false)
const memberName = computed(() => props.member?.member?.name || '')

function OnSetAdmin() {
  putSetOrgAdmin(store.org.id, props.member.member.id, !props.member.isAdmin).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
