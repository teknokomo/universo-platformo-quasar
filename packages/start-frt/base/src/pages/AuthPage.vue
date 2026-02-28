<!--
 * AuthPage - Supabase authentication page
 *
 * Handles user login and registration via Supabase.
 * Redirects to the start page after successful authentication.
 *
 * Equivalent of AuthPage.tsx from @universo/auth-frontend
-->
<template>
    <div class="auth-page flex flex-center" style="min-height: 100vh">
        <q-card class="auth-card q-pa-lg shadow-4" style="width: 100%; max-width: 420px">
            <!-- Logo / Brand -->
            <div class="text-center q-mb-xl">
                <div class="text-h5 text-weight-bold text-primary">Universo</div>
                <div class="text-subtitle2 text-grey-6">Platformo</div>
            </div>

            <div class="text-h6 text-weight-medium text-center q-mb-lg">
                {{ isSignUp ? t('auth.signUpButton') : t('auth.title') }}
            </div>

            <!-- Auth Form -->
            <q-form @submit.prevent="handleSubmit">
                <q-input
                    v-model="email"
                    :label="t('auth.emailLabel')"
                    type="email"
                    outlined
                    dense
                    class="q-mb-md"
                    :error="!!emailError"
                    :error-message="emailError"
                    autocomplete="email"
                />

                <q-input
                    v-model="password"
                    :label="t('auth.passwordLabel')"
                    :type="showPassword ? 'text' : 'password'"
                    outlined
                    dense
                    class="q-mb-lg"
                    :error="!!passwordError"
                    :error-message="passwordError"
                    :autocomplete="isSignUp ? 'new-password' : 'current-password'"
                >
                    <template #append>
                        <q-icon
                            :name="showPassword ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="showPassword = !showPassword"
                        />
                    </template>
                </q-input>

                <!-- Error message -->
                <q-banner v-if="authError" dense rounded class="bg-negative text-white q-mb-md">
                    {{ t(authError) }}
                </q-banner>

                <!-- Sign in / Sign up button -->
                <q-btn
                    type="submit"
                    color="primary"
                    :label="isSignUp ? t('auth.signUpButton') : t('auth.signInButton')"
                    class="full-width"
                    size="lg"
                    :loading="loading"
                    unelevated
                />
            </q-form>

            <!-- Toggle sign in / sign up -->
            <div class="text-center q-mt-lg">
                <q-btn
                    flat
                    no-caps
                    :label="isSignUp ? t('auth.signInLink') : t('auth.signUpLink')"
                    color="primary"
                    @click="isSignUp = !isSignUp"
                />
            </div>
        </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default defineComponent({
    name: 'AuthPage',
    setup() {
        const { t } = useI18n()
        const router = useRouter()
        const { signIn, signUp, loading, error: authError } = useAuth()

        const email = ref('')
        const password = ref('')
        const showPassword = ref(false)
        const isSignUp = ref(false)
        const emailError = ref('')
        const passwordError = ref('')

        const validateForm = (): boolean => {
            emailError.value = ''
            passwordError.value = ''

            if (!email.value) {
                emailError.value = t('auth.validation.emailRequired')
                return false
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                emailError.value = t('auth.validation.emailInvalid')
                return false
            }
            if (!password.value) {
                passwordError.value = t('auth.validation.passwordRequired')
                return false
            }
            if (password.value.length < 6) {
                passwordError.value = t('auth.validation.passwordTooShort')
                return false
            }

            return true
        }

        const handleSubmit = async () => {
            if (!validateForm()) return

            try {
                if (isSignUp.value) {
                    await signUp(email.value, password.value)
                } else {
                    await signIn(email.value, password.value)
                    await router.push('/')
                }
            } catch {
                // Error handled in useAuth composable
            }
        }

        return {
            t,
            email,
            password,
            showPassword,
            isSignUp,
            loading,
            authError,
            emailError,
            passwordError,
            handleSubmit
        }
    }
})
</script>

<style scoped lang="scss">
.auth-page {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-card {
    border-radius: 16px;
}
</style>
