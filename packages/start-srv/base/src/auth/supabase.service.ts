/**
 * Supabase Service
 * Server-side proxy for Supabase Auth operations.
 * The frontend NEVER calls Supabase directly — all auth flows go through here.
 */
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export interface SignInResult {
    userId: string
    userEmail: string
    accessToken: string
    refreshToken: string
    /** Access token expiry in seconds (to align cookie maxAge) */
    expiresIn: number
}

export interface SignUpResult {
    userId: string | null
    emailConfirmation: boolean
}

export interface RefreshResult {
    accessToken: string
    refreshToken: string
    expiresIn: number
}

@Injectable()
export class SupabaseService {
    private readonly client: SupabaseClient

    constructor(private readonly configService: ConfigService) {
        const url = this.configService.getOrThrow<string>('SUPABASE_URL')
        const key = this.configService.getOrThrow<string>('SUPABASE_ANON_KEY')

        // Server-side client: disable session persistence and auto-refresh
        // (sessions are managed via HTTP-only cookies, not in-memory)
        this.client = createClient(url, key, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })
    }

    /**
     * Authenticate user with email and password via Supabase.
     * Returns both the short-lived access token and the long-lived refresh token.
     */
    async signIn(email: string, password: string): Promise<SignInResult> {
        const { data, error } = await this.client.auth.signInWithPassword({ email, password })
        if (error || !data.session || !data.user) {
            throw new UnauthorizedException(error?.message ?? 'Invalid credentials')
        }
        return {
            userId: data.user.id,
            userEmail: data.user.email ?? '',
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresIn: data.session.expires_in ?? 3600
        }
    }

    /**
     * Register a new user via Supabase.
     */
    async signUp(email: string, password: string): Promise<SignUpResult> {
        const { data, error } = await this.client.auth.signUp({ email, password })
        if (error) {
            throw new BadRequestException(error.message)
        }
        return {
            userId: data.user?.id ?? null,
            // When session is null, Supabase requires email confirmation
            emailConfirmation: !data.session
        }
    }

    /**
     * Exchange a refresh token for a new access token.
     * Called by the /auth/refresh endpoint when the access token has expired.
     */
    async refreshSession(refreshToken: string): Promise<RefreshResult> {
        const { data, error } = await this.client.auth.refreshSession({ refresh_token: refreshToken })
        if (error || !data.session) {
            throw new UnauthorizedException(error?.message ?? 'Session expired, please sign in again')
        }
        return {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            expiresIn: data.session.expires_in ?? 3600
        }
    }
}
