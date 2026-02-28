/**
 * Supabase JWT Strategy
 * Validates Supabase JWTs stored in the HTTP-only session cookie.
 * Token extraction order: HTTP-only cookie → Authorization Bearer header (fallback).
 */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { ACCESS_TOKEN_COOKIE } from './auth.controller'

export interface SupabaseJwtPayload {
    /** Supabase user UUID */
    sub?: string
    id?: string
    email: string
    role: string
    aud: string
}

/**
 * Extract JWT from the HTTP-only session cookie.
 * Falls back to the Authorization Bearer header for API clients.
 */
const cookieOrBearerExtractor = (req: any): string | null => {
    const fromCookie: string | undefined = req?.cookies?.[ACCESS_TOKEN_COOKIE]
    if (fromCookie) return fromCookie
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req)
}

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        const jwtSecret = configService.get<string>('SUPABASE_JWT_SECRET')

        if (!jwtSecret) {
            throw new Error('[SupabaseStrategy] SUPABASE_JWT_SECRET environment variable is required')
        }

        super({
            jwtFromRequest: cookieOrBearerExtractor,
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        })
    }

    /**
     * Validate the Supabase JWT payload.
     * Returns the user object that is attached to `req.user`.
     */
    validate(payload: SupabaseJwtPayload) {
        const id = payload.sub ?? payload.id
        if (!id) {
            throw new UnauthorizedException('Invalid token payload')
        }
        return { id, email: payload.email, role: payload.role }
    }
}
