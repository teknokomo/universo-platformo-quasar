/**
 * useAuth composable
 * Manages authentication state by communicating with the NestJS backend.
 * The frontend has NO direct Supabase access — all auth flows go through /api/v1/auth/*.
 *
 * Session is maintained via two HTTP-only cookies set by the backend:
 *   sb_access_token  — short-lived JWT (matches Supabase JWT expiry, typically 1 hour)
 *   sb_refresh_token — long-lived token (7 days) for issuing new access tokens
 *
 * Uses the shared apiClient which sends cookies automatically and transparently
 * refreshes the access token on 401.
 */
import { ref, computed, watch } from 'vue'
import type { AxiosError } from 'axios'
import apiClient, { sessionExpired } from './apiClient'

export interface AuthUser {
    id: string
    email: string
    role?: string
}

// Shared reactive state (module-level singleton)
const user = ref<AuthUser | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// When the shared apiClient signals a session expiry (refresh failed), clear user
watch(sessionExpired, (expired) => {
    if (expired) {
        user.value = null
        sessionExpired.value = false
    }
})

// Check auth state on module load by calling the backend
apiClient
    .get<{ user: AuthUser }>('/auth/me')
    .then(({ data }) => {
        user.value = data.user
    })
    .catch(() => {
        user.value = null
    })
    .finally(() => {
        loading.value = false
    })

/**
 * Authentication composable
 * All methods communicate exclusively with the NestJS backend.
 */
export function useAuth() {
    const isAuthenticated = computed(() => !!user.value)

    /**
     * Sign in with email and password.
     * Backend calls Supabase, sets HTTP-only cookies, returns user info.
     */
    const signIn = async (email: string, password: string): Promise<void> => {
        error.value = null
        loading.value = true
        try {
            const { data } = await apiClient.post<{ user: AuthUser }>('/auth/login', { email, password })
            user.value = data.user
        } catch (err) {
            error.value = mapAuthError(err as AxiosError)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Register a new account.
     * Returns whether email confirmation is required.
     */
    const signUp = async (email: string, password: string): Promise<{ emailConfirmation: boolean }> => {
        error.value = null
        loading.value = true
        try {
            const { data } = await apiClient.post<{ emailConfirmation: boolean }>('/auth/register', { email, password })
            return data
        } catch (err) {
            error.value = mapAuthError(err as AxiosError)
            throw err
        } finally {
            loading.value = false
        }
    }

    /**
     * Sign out the current user.
     * Backend clears both HTTP-only session cookies.
     */
    const signOut = async (): Promise<void> => {
        error.value = null
        try {
            await apiClient.post('/auth/logout')
        } finally {
            user.value = null
        }
    }

    return {
        user,
        loading,
        error,
        isAuthenticated,
        signIn,
        signUp,
        signOut
    }
}

/**
 * Map backend error responses to i18n translation keys
 */
function mapAuthError(err: AxiosError<{ message?: string }>): string {
    const status = err.response?.status
    const message = (err.response?.data?.message ?? '').toLowerCase()

    if (status === 401 || message.includes('invalid') || message.includes('credentials')) {
        return 'auth.errors.invalidCredentials'
    }
    if (message.includes('email not confirmed')) {
        return 'auth.errors.emailNotConfirmed'
    }
    return 'auth.errors.generic'
}
