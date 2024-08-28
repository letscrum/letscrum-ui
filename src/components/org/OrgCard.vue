<template>
  <v-card
    class="mx-auto"
    outlined
    tile
    @click="onLoadOrg"
  >
    <v-list-item three-line>
      <v-list-item-subtitle>
        <div class="text-overline">
          {{ org.members.length + 1 }} Members
        </div>
      </v-list-item-subtitle>
      <v-list-item-title class="text-h5">
        {{ org.name }}
      </v-list-item-title>
      <template #prepend>
        <v-avatar size="x-large" rounded="0" :color="uuidToColor(org.id)">{{ org.name.substring(0, 1) }}</v-avatar>
      </template>
    </v-list-item>
  </v-card>
</template>

<script setup>
import { getGetOrg } from '@/apis/org'
import { useAppStore } from '@/stores/app'
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { uuidToColor } from '@/utils/utils'

const store = useAppStore()
const router = useRouter()

const props = defineProps(['org'])

const org = ref(props.org)
console.log('org', org.value)

function onLoadOrg() {
  getGetOrg(org.value.id).then((res) => {
    console.log(res);
    if (res.status === 200) {
      store.setOrg(res.data.item);
      router.push(`/orgs/${res.data.item.id}/projects`);
    }
  });
}
</script>
