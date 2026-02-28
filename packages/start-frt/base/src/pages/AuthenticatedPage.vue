<!--
 * AuthenticatedPage - Onboarding wizard for new authenticated users
 *
 * Displays a wizard to help users select their interests:
 * - Projects (Global Goals)
 * - Campaigns (Personal Interests)
 * - Clusters (Platform Features)
 *
 * If onboarding is already completed, shows the completion screen.
 * Footer with contact information is shown at the bottom.
 *
 * Equivalent of AuthenticatedStartPage.tsx from the React implementation
-->
<template>
    <div class="authenticated-page">
        <!-- Loading state while checking onboarding status -->
        <div v-if="loading" class="flex flex-center" style="min-height: 50vh">
            <q-spinner size="50px" color="primary" />
        </div>

        <!-- Completion screen for users who have already completed onboarding -->
        <div v-else-if="onboardingCompleted" class="authenticated-content">
            <div class="q-pa-xl text-center">
                <q-icon name="check_circle" size="5rem" color="positive" class="q-mb-lg" />
                <h2 class="text-h4 text-weight-bold q-mb-md">{{ t('onboarding.completion.title') }}</h2>
                <p class="text-body1 text-grey-7 q-mb-xl">{{ t('onboarding.completion.description') }}</p>
                <q-btn
                    outline
                    color="primary"
                    :label="t('onboarding.completion.startOverButton')"
                    @click="onboardingCompleted = false"
                />
            </div>
        </div>

        <!-- Onboarding wizard for users who haven't completed onboarding -->
        <div v-else class="authenticated-content">
            <OnboardingWizard @complete="onboardingCompleted = true" />
        </div>

        <!-- Footer -->
        <StartFooter />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import OnboardingWizard from '../components/OnboardingWizard.vue'
import StartFooter from '../components/StartFooter.vue'
import { useOnboarding } from '../composables/useOnboarding'

export default defineComponent({
    name: 'AuthenticatedPage',
    components: {
        OnboardingWizard,
        StartFooter
    },
    setup() {
        const { t } = useI18n()
        const { fetchItems, items } = useOnboarding()
        const loading = ref(true)
        const onboardingCompleted = ref<boolean>(false)

        onMounted(async () => {
            try {
                await fetchItems()
                onboardingCompleted.value = items.value?.onboardingCompleted ?? false
            } catch (err) {
                console.error('[AuthenticatedPage] Failed to check onboarding status, defaulting to show wizard:', err)
                onboardingCompleted.value = false
            } finally {
                loading.value = false
            }
        })

        return {
            t,
            loading,
            onboardingCompleted
        }
    }
})
</script>

<style scoped lang="scss">
.authenticated-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.authenticated-content {
    flex: 1;
    padding-top: 2rem;
}
</style>
