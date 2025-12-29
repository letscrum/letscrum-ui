<template>
  <v-dialog
    v-model="dialog"
    width="50%"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <div v-bind="activatorProps">
        <slot></slot>
      </div>
      <!-- <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps" @click="onOpenCreate()">
        Create
      </v-btn> -->
    </template>

    <v-card
      prepend-icon="mdi-map-marker"
      :text="props.member.isAdmin ? $t('org.member.setAdmin.remove') : $t('org.member.setAdmin.set')"
      :title="$t('org.member.setAdmin.title')"
    >
      <template #actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false">
          {{ $t('org.member.setAdmin.cancel') }}
        </v-btn>

        <v-btn @click="OnSetAdmin()">
          {{ $t('org.member.setAdmin.confirm') }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { putSetOrgAdmin } from '@/apis/org'
const emit = defineEmits(['after'])

const props = defineProps(['member'])

import { ref } from 'vue';
import { useAppStore } from '@/stores/app'
const store = useAppStore()

const dialog = ref(false)


function OnSetAdmin() {
  putSetOrgAdmin(store.org.id, props.member.member.id, !props.member.isAdmin).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
