<template>
  <v-card
    class="mx-auto"
    outlined
    tile
    @click="onLoadOrg"
  >
    <v-list-item three-line>
      <v-list-item-subtitle>
        <div class="text-overline mb-4">
          1
        </div>
        <v-list-item-title class="text-h5 mb-1">
          {{ org.name }}
        </v-list-item-title>
      </v-list-item-subtitle>
    </v-list-item>
  </v-card>
</template>

<script setup>
import { getGetOrg } from '@/apis/org'
import { useAppStore } from '@/stores/app'
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

const props = defineProps(['org'])

const org = ref(props.org)

function onLoadOrg() {
  getGetOrg(org.value.id).then((res) => {
    console.log(res);
    if (res.status === 200) {
      store.setOrg({
        id: res.data.item.id,
        name: res.data.item.name,
        displayName: res.data.item.displayName,
        description: res.data.item.description,
      })
      router.push(`/orgs/${res.data.item.id}/projects`);
    }
  });
}
</script>
