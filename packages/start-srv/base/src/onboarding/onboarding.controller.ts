/**
 * Onboarding Controller
 * REST API endpoints for the user onboarding flow
 *
 * GET  /api/v1/onboarding/items  - Get available onboarding items
 * POST /api/v1/onboarding/join   - Join selected items
 */
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.guard'
import { OnboardingService } from './onboarding.service'
import { JoinItemsDto } from './onboarding.dto'

interface AuthenticatedRequest {
    user: {
        id: string
        email: string
        role: string
    }
}

@Controller('onboarding')
@UseGuards(AuthGuard)
export class OnboardingController {
    constructor(private readonly onboardingService: OnboardingService) {}

    /**
     * GET /onboarding/items
     * Returns available onboarding items (Projects, Campaigns, Clusters)
     * and the user's current selection status
     */
    @Get('items')
    async getItems(@Request() req: AuthenticatedRequest) {
        const userId: string = req.user?.id
        return this.onboardingService.getOnboardingItems(userId)
    }

    /**
     * POST /onboarding/join
     * Saves the user's selected onboarding items
     */
    @Post('join')
    async joinItems(@Request() req: AuthenticatedRequest, @Body() body: JoinItemsDto) {
        const userId: string = req.user?.id
        return this.onboardingService.joinItems(userId, body)
    }
}
