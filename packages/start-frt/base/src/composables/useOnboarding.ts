/**
 * useOnboarding composable
 * Manages onboarding state and API calls for authenticated users.
 * Uses the shared apiClient which handles HTTP-only session cookies and
 * automatically refreshes the access token on 401.
 */
import { ref } from 'vue'
import apiClient from './apiClient'

export interface OnboardingItem {
    id: string
    name: string
    description?: string
    isSelected: boolean
}

export interface OnboardingItems {
    projects: OnboardingItem[]
    campaigns: OnboardingItem[]
    clusters: OnboardingItem[]
    onboardingCompleted: boolean
}

export interface JoinItemsRequest {
    projectIds: string[]
    campaignIds: string[]
    clusterIds: string[]
}

/**
 * Onboarding composable
 * Fetches and manages onboarding data for authenticated users.
 */
export function useOnboarding() {
    const items = ref<OnboardingItems | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Fetch available onboarding items from the backend
     */
    const fetchItems = async (): Promise<void> => {
        loading.value = true
        error.value = null
        try {
            const response = await apiClient.get<OnboardingItems>('/onboarding/items')
            items.value = response.data
        } catch (err) {
            console.error('[useOnboarding] Failed to fetch items:', err)
            // Default to showing wizard on error
            items.value = {
                projects: [],
                campaigns: [],
                clusters: [],
                onboardingCompleted: false
            }
        } finally {
            loading.value = false
        }
    }

    /**
     * Submit selected onboarding items
     */
    const joinItems = async (data: JoinItemsRequest): Promise<void> => {
        loading.value = true
        error.value = null
        try {
            await apiClient.post('/onboarding/join', data)
            if (items.value) {
                items.value.onboardingCompleted = true
            }
        } catch (err) {
            console.error('[useOnboarding] Failed to join items:', err)
            error.value = 'onboarding.errors.saveFailed'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        items,
        loading,
        error,
        fetchItems,
        joinItems
    }
}
