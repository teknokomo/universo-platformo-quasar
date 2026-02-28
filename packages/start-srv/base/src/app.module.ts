/**
 * Root application module
 * Universo Platformo - Start Backend
 */
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module'
import { OnboardingModule } from './onboarding/onboarding.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env']
        }),
        // Default throttler storage (in-memory). Fine for single-instance deployments.
        // For multi-instance, swap for ThrottlerStorageRedisService.
        ThrottlerModule.forRoot([
            {
                ttl: 60_000,
                limit: 60
            }
        ]),
        AuthModule,
        OnboardingModule
    ]
})
export class AppModule {}
