/**
 * Supabase JWT Strategy
 * Validates Supabase access tokens for API authentication
 */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

export interface SupabaseUser {
    sub?: string
    id?: string
    email: string
    role: string
    aud: string
}

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        const jwtSecret = configService.get<string>('SUPABASE_JWT_SECRET')

        if (!jwtSecret) {
            throw new Error('[SupabaseStrategy] SUPABASE_JWT_SECRET environment variable is required')
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret
        })
    }

    /**
     * Validate the JWT payload from Supabase
     * The payload contains user information from the Supabase JWT
     */
    validate(payload: SupabaseUser) {
        if (!payload.sub && !payload.id) {
            throw new UnauthorizedException('Invalid token payload')
        }

        return {
            id: payload.sub || payload.id,
            email: payload.email,
            role: payload.role
        }
    }
}
