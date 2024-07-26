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
      :text="props.user.isSuperAdmin ? 'Remove super admin?' : 'Set as super admin?'"
      :title="props.user.id"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false">
          Disagree
        </v-btn>

        <v-btn @click="OnSetSuperAdmin()">
          Agree
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { putSetSuperAdmin } from '@/apis/user'
const emit = defineEmits(['after'])

const props = defineProps(['user'])

import { ref } from 'vue';

const dialog = ref(false)


function OnSetSuperAdmin() {
  putSetSuperAdmin(props.user.id, !props.user.isSuperAdmin).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
