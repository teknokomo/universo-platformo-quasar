/**
 * useAuth composable
 * Manages authentication state by communicating with the NestJS backend.
 * The frontend has NO direct Supabase access — all auth flows go through /api/v1/auth/*.
 *
 * Session is maintained via an HTTP-only cookie set by the backend.
 * axios `withCredentials: true` ensures the cookie is sent on every request.
 */
import { ref, computed } from 'vue'
import axios, { type AxiosError } from 'axios'

export interface AuthUser {
    id: string
    email: string
    role?: string
}

// Shared API client — withCredentials sends the HTTP-only session cookie automatically
const authApi = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

// Shared reactive state (module-level singleton)
const user = ref<AuthUser | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Check auth state on module load by calling the backend
authApi
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
     * Backend calls Supabase, sets HTTP-only cookie, returns user info.
     */
    const signIn = async (email: string, password: string): Promise<void> => {
        error.value = null
        loading.value = true
        try {
            const { data } = await authApi.post<{ user: AuthUser }>('/auth/login', { email, password })
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
            const { data } = await authApi.post<{ emailConfirmation: boolean }>('/auth/register', { email, password })
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
     * Backend clears the HTTP-only session cookie.
     */
    const signOut = async (): Promise<void> => {
        error.value = null
        try {
            await authApi.post('/auth/logout')
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
