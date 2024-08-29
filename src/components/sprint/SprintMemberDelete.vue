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
      text="Delete member?"
      title="Delete member?"
    >
      <template #actions>
        <v-spacer></v-spacer>

        <v-btn @click="dialog = false">
          Disagree
        </v-btn>

        <v-btn @click="OnDeleteMember()">
          Agree
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { deleteRemoveSprintMember } from '@/apis/sprint';
const emit = defineEmits(['after'])

const props = defineProps(['member'])

import { ref } from 'vue';
import { useAppStore } from '@/stores/app'
const store = useAppStore()

const dialog = ref(false)


function OnDeleteMember() {
  deleteRemoveSprintMember(store.org.id, store.project.id, store.sprint.id, props.member.userId).then(() => {
    dialog.value = false
    emit('after')
  })
}
</script>
