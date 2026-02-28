/**
 * Onboarding Module
 * Provides API endpoints for the user onboarding flow
 */
import { Module } from '@nestjs/common'
import { OnboardingController } from './onboarding.controller'
import { OnboardingService } from './onboarding.service'
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [AuthModule],
    controllers: [OnboardingController],
    providers: [OnboardingService]
})
export class OnboardingModule {}
