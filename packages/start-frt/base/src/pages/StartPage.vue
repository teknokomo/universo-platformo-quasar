<!--
 * StartPage - Conditional start page based on authentication status
 *
 * Shows:
 * - GuestPage for non-authenticated users (landing with testimonials)
 * - AuthenticatedPage for authenticated users (onboarding wizard)
 *
 * Equivalent of StartPage.tsx from the React implementation
-->
<template>
    <!-- Show loader while checking authentication status -->
    <div v-if="loading" class="flex flex-center" style="min-height: 100vh">
        <q-spinner size="50px" color="primary" />
    </div>

    <!-- Render appropriate page based on authentication status -->
    <AuthenticatedPage v-else-if="isAuthenticated" />
    <GuestPage v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '../composables/useAuth'
import GuestPage from './GuestPage.vue'
import AuthenticatedPage from './AuthenticatedPage.vue'

export default defineComponent({
    name: 'StartPage',
    components: {
        GuestPage,
        AuthenticatedPage
    },
    setup() {
        const { isAuthenticated, loading } = useAuth()
        return { isAuthenticated, loading }
    }
})
</script>
