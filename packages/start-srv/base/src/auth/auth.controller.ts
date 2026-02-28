/**
 * Auth Controller
 * All Supabase authentication flows are proxied through these endpoints.
 * The frontend has no direct access to Supabase — it only talks to this controller.
 *
 * POST /api/v1/auth/login    — sign in with email/password, sets HTTP-only session cookie
 * POST /api/v1/auth/register — register new user
 * POST /api/v1/auth/logout   — clear session cookie
 * GET  /api/v1/auth/me       — return current authenticated user (requires valid cookie)
 */
import { Controller, Post, Get, Body, UseGuards, Request, Res, HttpCode } from '@nestjs/common'
import { SupabaseService } from './supabase.service'
import { AuthGuard } from './auth.guard'

/** Duration of one day in seconds */
const SECONDS_PER_DAY = 86_400

/** Session cookie lifetime: 7 days */
const COOKIE_MAX_AGE_SECONDS = SECONDS_PER_DAY * 7

/** Name of the HTTP-only session cookie */
export const ACCESS_TOKEN_COOKIE = 'sb_access_token'

interface LoginDto {
    email: string
    password: string
}

interface RegisterDto {
    email: string
    password: string
}

interface AuthenticatedUser {
    id: string
    email: string
    role: string
}

@Controller('auth')
export class AuthController {
    constructor(private readonly supabaseService: SupabaseService) {}

    /**
     * POST /auth/login
     * Authenticates user via Supabase and stores the JWT in an HTTP-only cookie.
     * Returns minimal user info (no tokens exposed to the browser).
     */
    @Post('login')
    @HttpCode(200)
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) reply: any) {
        const { userId, userEmail, accessToken } = await this.supabaseService.signIn(dto.email, dto.password)

        reply.setCookie(ACCESS_TOKEN_COOKIE, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: COOKIE_MAX_AGE_SECONDS
        })

        return { user: { id: userId, email: userEmail } }
    }

    /**
     * POST /auth/register
     * Registers a new user via Supabase.
     * Returns whether email confirmation is required.
     */
    @Post('register')
    @HttpCode(200)
    async register(@Body() dto: RegisterDto) {
        const result = await this.supabaseService.signUp(dto.email, dto.password)
        return {
            user: result.userId ? { id: result.userId } : null,
            emailConfirmation: result.emailConfirmation
        }
    }

    /**
     * POST /auth/logout
     * Clears the session cookie. The Supabase JWT will expire naturally.
     */
    @Post('logout')
    @HttpCode(200)
    async logout(@Res({ passthrough: true }) reply: any) {
        reply.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' })
        return { success: true }
    }

    /**
     * GET /auth/me
     * Returns current user info extracted from the validated JWT cookie.
     * Returns 401 if not authenticated.
     */
    @Get('me')
    @UseGuards(AuthGuard)
    getMe(@Request() req: { user: AuthenticatedUser }) {
        return { user: req.user }
    }
}
