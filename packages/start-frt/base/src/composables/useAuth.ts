/**
 * useAuth composable
 * Provides Supabase authentication state and methods for Vue components
 * Equivalent of the React useAuth hook from @universo/auth-frontend
 */
import { ref, computed } from 'vue'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../boot/supabase'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Initialize auth listener once at module level (singleton pattern)
// This avoids multiple listeners and ensures auth state is shared across all components
const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
    user.value = newSession?.user ?? null
    loading.value = false
})

// Initialize session immediately
supabase.auth.getSession().then(({ data: sessionData, error: sessionError }) => {
    if (sessionError) {
        console.error('[useAuth] Failed to get session:', sessionError)
        error.value = sessionError.message
    } else {
        session.value = sessionData.session
        user.value = sessionData.session?.user ?? null
    }
    loading.value = false
})

/**
 * Authentication composable
 * Manages Supabase authentication state across the application
 */
export function useAuth() {
    const isAuthenticated = computed(() => !!user.value)

    /**
     * Sign in with email and password
     */
    const signIn = async (email: string, password: string): Promise<void> => {
        error.value = null
        loading.value = true
        try {
            const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
            if (authError) {
                error.value = mapAuthError(authError)
                throw authError
            }
        } finally {
            loading.value = false
        }
    }

    /**
     * Sign up with email and password
     */
    const signUp = async (email: string, password: string): Promise<void> => {
        error.value = null
        loading.value = true
        try {
            const { error: authError } = await supabase.auth.signUp({ email, password })
            if (authError) {
                error.value = mapAuthError(authError)
                throw authError
            }
        } finally {
            loading.value = false
        }
    }

    /**
     * Sign out the current user
     */
    const signOut = async (): Promise<void> => {
        error.value = null
        const { error: authError } = await supabase.auth.signOut()
        if (authError) {
            console.error('[useAuth] Sign out failed:', authError)
        }
        user.value = null
        session.value = null
    }

    return {
        user,
        session,
        loading,
        error,
        isAuthenticated,
        signIn,
        signUp,
        signOut
    }
}

// Export cleanup for app teardown if needed
export const cleanupAuth = () => {
    authListener.subscription.unsubscribe()
}

/**
 * Map Supabase auth errors to i18n translation keys
 */
function mapAuthError(authError: AuthError): string {
    const message = authError.message?.toLowerCase() ?? ''
    if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
        return 'auth.errors.invalidCredentials'
    }
    if (message.includes('email not confirmed')) {
        return 'auth.errors.emailNotConfirmed'
    }
    return 'auth.errors.generic'
}
