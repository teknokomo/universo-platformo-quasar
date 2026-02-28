/**
 * Root application module
 * Universo Platformo - Start Backend
 */
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { OnboardingModule } from './onboarding/onboarding.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env']
        }),
        AuthModule,
        OnboardingModule
    ]
})
export class AppModule {}
