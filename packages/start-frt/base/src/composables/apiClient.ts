/**
 * Shared API client
 * A single axios instance used by all composables for authenticated API calls.
 *
 * Features:
 * - Reads base URL from `VITE_API_BASE_URL` environment variable (falls back to `/api/v1`)
 * - Sends HTTP-only session cookies automatically (`withCredentials: true`)
 * - Intercepts 401 responses to transparently refresh the access token via `/auth/refresh`,
 *   then retries the original request. If refresh fails, clears user-facing auth state.
 */
import axios from 'axios'
import { ref } from 'vue'
import type { AxiosError } from 'axios'

/** Reactive flag exposed to useAuth so it can clear user state on refresh failure */
export const sessionExpired = ref(false)

const apiBaseURL = import.meta.env?.VITE_API_BASE_URL ?? '/api/v1'

const apiClient = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
})

/** Whether a token refresh is currently in progress (prevents recursive refresh loops) */
let isRefreshing = false

/**
 * Response interceptor: on 401, attempt to refresh the access token once.
 * If the refresh succeeds, retry the original request.
 * If it fails (or this was already a refresh/login call), reject immediately.
 */
apiClient.interceptors.response.use(
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
                await apiClient.post('/auth/refresh')
                isRefreshing = false
                return apiClient(originalRequest)
            } catch {
                isRefreshing = false
                sessionExpired.value = true
            }
        }

        return Promise.reject(err)
    }
)

export default apiClient
