/**
 * useOnboarding composable
 * Manages onboarding state and API calls for authenticated users.
 * Authentication is handled via the HTTP-only session cookie set by the backend.
 * axios `withCredentials: true` ensures the cookie is included automatically.
 */
import { ref } from 'vue'
import axios from 'axios'

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

// Shared API client — the session cookie is sent automatically via withCredentials
const apiClient = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

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
