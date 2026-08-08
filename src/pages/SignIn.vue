<template>
  <DefaultLayout>
    <div class="ado-signin-bg d-flex align-center justify-center" style="min-height: calc(100vh - 48px);">
      <div class="ado-signin-card-wrapper">
        <div class="text-center mb-4">
          <v-img src="/images/logo-text.svg" width="180" class="mx-auto" />
          <p class="text-body-2 text-medium-emphasis mt-2">
            Lightweight Scrum &amp; Agile Project Management
          </p>
        </div>
        <SignInForm />
        <div class="text-center mt-4 text-caption text-medium-emphasis">
          © {{ new Date().getFullYear() }} Letscrum
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import SignInForm from '@/components/SignInForm.vue'
</script>

<style scoped>
.ado-signin-bg {
  background:
    linear-gradient(rgba(0, 120, 212, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 120, 212, 0.035) 1px, transparent 1px),
    rgb(var(--v-theme-background));
  background-size: 24px 24px;
  padding: 24px;
}
.ado-signin-card-wrapper {
  width: 100%;
  max-width: 400px;
}
</style>
