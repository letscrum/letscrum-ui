<template>
  <v-sheet border rounded class="pa-1 ma-1" :style="'border-left-color: ' + (props.workItem.type == 'Backlog' ? 'rgb(0, 156, 204)' : 'red') + '; border-left-width: 3px;'">
    <div class="pa-1 ma-1" style="border-style: solid; border-color: silver; line-height: normal; height: 28px; width: auto;">
      {{ props.workItem.title }}
    </div>
    <div class="pa-1 ma-1" style="border-style: solid; border-color: silver; line-height: normal; height: 22px; width: 10px;">
      {{ props.workItem.assignUser.name == undefined ? '  ' : props.workItem.assignUser.name }}
    </div>
    <div class="pa-1 ma-1" style="border-style: solid; border-color: silver; line-height: normal; height: 22px; width: auto;">
      {{ props.workItem.assignUser.name == undefined ? '  ' : props.workItem.assignUser.name }}
    </div>
  </v-sheet>
</template>

<script setup>
const props = defineProps(['workItem', 'status'])

console.log(props.workItem)

</script>
