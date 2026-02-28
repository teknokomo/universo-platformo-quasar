/**
 * Auth Controller
 * All Supabase authentication flows are proxied through these endpoints.
 * The frontend has no direct access to Supabase — it only talks to this controller.
 *
 * POST /api/v1/auth/login    — sign in with email/password, sets HTTP-only session cookies
 * POST /api/v1/auth/register — register new user
 * POST /api/v1/auth/logout   — clear session cookies
 * POST /api/v1/auth/refresh  — exchange refresh token for new access token
 * GET  /api/v1/auth/me       — return current authenticated user (requires valid cookie)
 */
import { Controller, Post, Get, Body, UseGuards, Request, Res, HttpCode, UnauthorizedException } from '@nestjs/common'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { IsEmail, IsString, MinLength } from 'class-validator'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { SupabaseService } from './supabase.service'
import { AuthGuard } from './auth.guard'

/** Duration of one day in seconds */
const SECONDS_PER_DAY = 86_400

/** Refresh token cookie lifetime: 7 days */
const REFRESH_COOKIE_MAX_AGE_SECONDS = SECONDS_PER_DAY * 7

/** Name of the HTTP-only access token cookie */
export const ACCESS_TOKEN_COOKIE = 'sb_access_token'

/** Name of the HTTP-only refresh token cookie */
const REFRESH_TOKEN_COOKIE = 'sb_refresh_token'

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export class LoginDto {
    @IsEmail()
    email!: string

    @IsString()
    @MinLength(6)
    password!: string
}

export class RegisterDto {
    @IsEmail()
    email!: string

    @IsString()
    @MinLength(6)
    password!: string
}

// ─── Controller ───────────────────────────────────────────────────────────────

interface AuthenticatedUser {
    id: string
    email: string
    role: string
}

/**
 * Set the access token cookie with expiry matching the JWT lifetime.
 */
function setAccessCookie(reply: FastifyReply, token: string, expiresIn: number): void {
    reply.setCookie(ACCESS_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: expiresIn
    })
}

/**
 * Set the long-lived refresh token cookie (7 days).
 */
function setRefreshCookie(reply: FastifyReply, token: string): void {
    reply.setCookie(REFRESH_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS
    })
}

@Controller('auth')
export class AuthController {
    constructor(private readonly supabaseService: SupabaseService) {}

    /**
     * POST /auth/login
     * Authenticates user via Supabase and stores tokens in HTTP-only cookies.
     * Access token cookie expires when the JWT expires (typically 1 hour).
     * Refresh token cookie expires in 7 days.
     * Returns minimal user info (no tokens exposed to the browser).
     *
     * Rate limited to 10 requests per minute per IP.
     */
    @Post('login')
    @HttpCode(200)
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { ttl: 60_000, limit: 10 } })
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) reply: FastifyReply) {
        const { userId, userEmail, accessToken, refreshToken, expiresIn } =
            await this.supabaseService.signIn(dto.email, dto.password)

        setAccessCookie(reply, accessToken, expiresIn)
        setRefreshCookie(reply, refreshToken)

        return { user: { id: userId, email: userEmail } }
    }

    /**
     * POST /auth/register
     * Registers a new user via Supabase.
     * Returns whether email confirmation is required.
     *
     * Rate limited to 5 requests per minute per IP.
     */
    @Post('register')
    @HttpCode(200)
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { ttl: 60_000, limit: 5 } })
    async register(@Body() dto: RegisterDto) {
        const result = await this.supabaseService.signUp(dto.email, dto.password)
        return {
            user: result.userId ? { id: result.userId } : null,
            emailConfirmation: result.emailConfirmation
        }
    }

    /**
     * POST /auth/logout
     * Clears both session cookies. The Supabase JWT will expire naturally.
     */
    @Post('logout')
    @HttpCode(200)
    async logout(@Res({ passthrough: true }) reply: FastifyReply) {
        reply.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' })
        reply.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' })
        return { success: true }
    }

    /**
     * POST /auth/refresh
     * Exchanges the refresh token (from cookie) for a new access token.
     * Called automatically by the frontend when a 401 is received.
     * Returns 401 if the refresh token is missing or expired.
     */
    @Post('refresh')
    @HttpCode(200)
    async refresh(@Request() req: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        const refreshToken: string | undefined = (req.cookies as Record<string, string>)?.[REFRESH_TOKEN_COOKIE]
        if (!refreshToken) {
            reply.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' })
            reply.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' })
            throw new UnauthorizedException('No refresh token')
        }

        try {
            const { accessToken, refreshToken: newRefreshToken, expiresIn } =
                await this.supabaseService.refreshSession(refreshToken)

            setAccessCookie(reply, accessToken, expiresIn)
            setRefreshCookie(reply, newRefreshToken)

            return { success: true }
        } catch {
            reply.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/' })
            reply.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' })
            throw new UnauthorizedException('Session expired, please sign in again')
        }
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
