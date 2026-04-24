<template>
  <DefaultLayout>
    <template #subheader>
      <div class="ado-subheader">
        <v-icon class="mr-2" color="primary">{{ meta.icon }}</v-icon>
        <span class="ado-subheader__title">{{ meta.title }}</span>
        <span class="ado-subheader__sub d-none d-sm-inline">{{ meta.sub }}</span>
        <v-spacer />
        <v-chip size="x-small" variant="tonal" color="primary" prepend-icon="mdi-progress-clock">
          Coming soon
        </v-chip>
      </div>
    </template>

    <div class="d-flex align-center justify-center pa-6" style="min-height: calc(100vh - 96px - 48px);">
      <v-card flat rounded="md" class="ado-border text-center pa-8" max-width="520">
        <v-avatar size="72" rounded="lg" color="primary" variant="tonal" class="mb-4">
          <v-icon size="40">{{ meta.icon }}</v-icon>
        </v-avatar>
        <h2 class="text-h5 font-weight-bold mb-2">{{ meta.title }}</h2>
        <p class="text-body-2 text-medium-emphasis mb-6">
          {{ meta.description }}
        </p>
        <div class="d-flex align-center justify-center" style="gap: 8px;">
          <v-btn
            v-if="meta.primaryTo"
            color="primary"
            variant="flat"
            size="small"
            :to="meta.primaryTo"
            :prepend-icon="meta.primaryIcon"
          >
            {{ meta.primaryLabel }}
          </v-btn>
          <v-btn
            variant="text"
            size="small"
            prepend-icon="mdi-arrow-left"
            @click="onBack"
          >
            Go back
          </v-btn>
        </div>
      </v-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Route-specific copy for the placeholder
const PRESETS = {
  About: {
    icon: 'mdi-information-outline',
    title: 'About Letscrum',
    sub: 'Lightweight Scrum & Agile project management',
    description: 'Letscrum helps small teams plan iterations, track work and ship faster. The full About page is on the way.',
    primaryTo: '/orgs',
    primaryIcon: 'mdi-domain',
    primaryLabel: 'Browse organizations',
  },
  Join: {
    icon: 'mdi-account-plus-outline',
    title: 'Join the team',
    sub: 'Create or join an organization',
    description: 'Invite-flow and self-service onboarding are coming soon. For now you can create your own organization to get started.',
    primaryTo: '/orgs',
    primaryIcon: 'mdi-domain-plus',
    primaryLabel: 'My organizations',
  },
  Contact: {
    icon: 'mdi-email-outline',
    title: 'Contact us',
    sub: 'Get in touch with the Letscrum team',
    description: 'A proper contact form is in the works. In the meantime please open an issue or discussion on GitHub.',
    primaryTo: null,
  },
  Others: {
    icon: 'mdi-dots-horizontal-circle-outline',
    title: 'More coming soon',
    sub: 'Additional features in development',
    description: 'This area is reserved for upcoming features. Stay tuned!',
    primaryTo: null,
  },
}

const meta = computed(() => {
  // Match by route name first, then by path segments for /user/* sub-routes.
  if (PRESETS[route.name]) return PRESETS[route.name]

  if (route.path.startsWith('/user/orgs')) {
    return {
      icon: 'mdi-domain',
      title: 'My organizations',
      sub: 'Organizations you belong to',
      description: 'A consolidated list of your organizations is coming soon. For now, use the top-level Organizations page.',
      primaryTo: '/orgs',
      primaryIcon: 'mdi-domain',
      primaryLabel: 'All organizations',
    }
  }
  if (route.path.startsWith('/user/changepassword')) {
    return {
      icon: 'mdi-lock-reset',
      title: 'Change password',
      sub: 'Account security',
      description: 'Password change is available from your profile. We will surface it directly here in a future update.',
      primaryTo: '/user/profile',
      primaryIcon: 'mdi-account-circle-outline',
      primaryLabel: 'Open profile',
    }
  }
  return {
    icon: 'mdi-progress-clock',
    title: route.meta?.title || 'Coming soon',
    sub: '',
    description: 'This page is not available yet. Check back soon.',
    primaryTo: '/orgs',
    primaryIcon: 'mdi-home-outline',
    primaryLabel: 'Home',
  }
})

function onBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/orgs')
  }
}
</script>
