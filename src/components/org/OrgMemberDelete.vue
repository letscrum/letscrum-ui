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
      :text="$t('org.member.delete.confirmText')"
      :title="$t('org.member.delete.title')"
    >
      <template #actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false">
          {{ $t('org.member.delete.cancel') }}
        </v-btn>

        <v-btn @click="OnDeleteMember()">
          {{ $t('org.member.delete.confirm') }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { deleteRemoveOrgMember } from '@/apis/org'
const emit = defineEmits(['after'])

const props = defineProps(['member'])

import { ref } from 'vue';
import { useAppStore } from '@/stores/app'
const store = useAppStore()

const dialog = ref(false)


function OnDeleteMember() {
  deleteRemoveOrgMember(store.org.id, props.member.member.id).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
