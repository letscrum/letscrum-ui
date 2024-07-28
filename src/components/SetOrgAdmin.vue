<template>
  <v-dialog
    width="50%"
    persistent
    v-model="dialog"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <div v-bind="activatorProps">
        <slot></slot>
      </div>
      <!-- <v-btn outlined class="float-right" tile prepend-icon="mdi-pencil" v-bind="activatorProps" @click="onOpenCreate()">
        Create
      </v-btn> -->
    </template>

    <v-card
      prepend-icon="mdi-map-marker"
      :text="props.member.isAdmin ? 'Remove admin?' : 'Set as admin?'"
      :title="props.member.member.id"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false">
          Disagree
        </v-btn>

        <v-btn @click="OnSetAdmin()">
          Agree
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { getSetOrgAdmin } from '@/apis/org'
const emit = defineEmits(['after'])

const props = defineProps(['member'])

import { ref } from 'vue';
import { useAppStore } from '@/stores/app'
const store = useAppStore()

const dialog = ref(false)


function OnSetAdmin() {
  getSetOrgAdmin(store.org.id, props.member.member.id, !props.member.isAdmin).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
