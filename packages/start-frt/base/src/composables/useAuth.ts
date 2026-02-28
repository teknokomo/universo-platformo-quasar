/**
 * useAuth composable
 * Manages authentication state by communicating with the NestJS backend.
 * The frontend has NO direct Supabase access — all auth flows go through /api/v1/auth/*.
 *
 * Session is maintained via two HTTP-only cookies set by the backend:
 *   sb_access_token  — short-lived JWT (matches Supabase JWT expiry, typically 1 hour)
 *   sb_refresh_token — long-lived token (7 days) for issuing new access tokens
 *
 * axios `withCredentials: true` ensures both cookies are sent on every request.
 * An axios response interceptor transparently refreshes the access token on 401.
 */
import { ref, computed } from 'vue'
import axios, { type AxiosError } from 'axios'

export interface AuthUser {
    id: string
    email: string
    role?: string
}

// Shared API client — withCredentials sends the HTTP-only session cookies automatically
const authApi = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

// Shared reactive state (module-level singleton)
const user = ref<AuthUser | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

/** Whether a token refresh is currently in progress (prevents recursive refresh loops) */
let isRefreshing = false

/**
 * Attach a response interceptor that automatically attempts to refresh the
 * access token when a 401 is received, then retries the original request.
 * If the refresh also fails, the user is logged out (user.value = null).
 */
authApi.interceptors.response.use(
    (response) => response,
    async (err: AxiosError) => {
        const originalRequest = err.config as any
        const is401 = err.response?.status === 401
        const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh')
        const isLoginEndpoint = originalRequest?.url?.includes('/auth/login')

        if (is401 && !isRefreshing && !originalRequest?._retried && !isRefreshEndpoint && !isLoginEndpoint) {
            originalRequest._retried = true
            isRefreshing = true
            try {
                await authApi.post('/auth/refresh')
                isRefreshing = false
                return authApi(originalRequest)
            } catch {
                isRefreshing = false
                user.value = null
            }
        }

        return Promise.reject(err)
    }
)

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
     * Backend calls Supabase, sets HTTP-only cookies, returns user info.
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
     * Backend clears both HTTP-only session cookies.
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
