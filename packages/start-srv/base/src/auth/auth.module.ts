/**
 * Auth Module
 * Handles Supabase JWT authentication for the NestJS backend
 */
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SupabaseStrategy } from './supabase.strategy'
import { AuthGuard } from './auth.guard'

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('SUPABASE_JWT_SECRET'),
                signOptions: { expiresIn: '1h' }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [SupabaseStrategy, AuthGuard],
    exports: [AuthGuard, PassportModule]
})
export class AuthModule {}
