<template>
  <div class="flex">
    <VueDraggable
      v-model="lists.list1"
      class="flex flex-col gap-2 p-4 w-300px h-300px m-auto bg-gray-500/5 rounded overflow-auto"
      style="width: 300px; height: 300px;"
      animation="150"
      ghost-class="ghost"
      group="people"
      @update="onUpdate"
      @add="onAdd"
      @remove="remove"
    >
      <div
        v-for="item in lists.list1"
        :key="item.id"
        class="cursor-move h-30 bg-gray-500/5 rounded p-3"
      >
        {{ item.name }}
      </div>
    </VueDraggable>
    <VueDraggable
      v-model="lists.list2"
      class="flex flex-col gap-2 p-4 w-300px h-300px m-auto bg-gray-500/5 rounded overflow-auto"
      style="width: 300px; height: 300px;"
      animation="150"
      group="people"
      ghost-class="ghost"
      @update="onUpdate"
      @add="onAdd"
      @remove="remove"
    >
      <div
        v-for="item in lists.list2"
        :key="item.id"
        class="cursor-move h-30 bg-gray-500/5 rounded p-3"
      >
        {{ item.name }}
      </div>
    </VueDraggable>
  </div>
  <div class="flex justify-between">
    <preview-list :list="lists.list1" />
    <preview-list :list="lists.list2" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
const lists = ref({
  list1: [
  {
    name: 'Joao',
    id: '1'
  },
  {
    name: 'Jean',
    id: '2'
  },
  {
    name: 'Johanna',
    id: '3'
  },
  {
    name: 'Juan',
    id: '4'
  }
],
list2: [
  {
    name: 'Joao-2',
    id: '1-2'
  },
  {
    name: 'Jean-2',
    id: '2-2'
  },
  {
    name: 'Johanna-2',
    id: '3-2'
  },
  {
    name: 'Juan-2',
    id: '4-2'
  }
]
})
function onUpdate() {
  console.log('update')
}
function onAdd() {
  console.log('add')
}
function remove() {
  console.log('remove')
}
</script>
