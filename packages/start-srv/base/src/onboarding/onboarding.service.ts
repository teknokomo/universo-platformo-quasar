/**
 * Onboarding Service
 * Business logic for the user onboarding flow
 *
 * Note: This is a base implementation that returns mock data.
 * In a full implementation, this would connect to a database
 * (e.g., via TypeORM with Supabase PostgreSQL) to manage
 * Projects, Campaigns, and Clusters entities.
 */
import { Injectable } from '@nestjs/common'
import type { JoinItemsDto, OnboardingItemsResponse } from './onboarding.dto'

// In-memory store for demo purposes
// In production, this would be replaced with TypeORM entity operations
const userOnboardingStatus = new Map<string, boolean>()

@Injectable()
export class OnboardingService {
    /**
     * Get available onboarding items for a user
     * Returns Projects (Global Goals), Campaigns (Personal Interests), Clusters (Platform Features)
     */
    async getOnboardingItems(userId: string): Promise<OnboardingItemsResponse> {
        const onboardingCompleted = userOnboardingStatus.get(userId) ?? false

        // Base implementation returns empty lists
        // In a full implementation, this would query the database for
        // items owned by the system admin user
        return {
            projects: [],
            campaigns: [],
            clusters: [],
            onboardingCompleted
        }
    }

    /**
     * Save selected onboarding items for a user
     * Marks user as having completed onboarding
     */
    async joinItems(
        userId: string,
        data: JoinItemsDto
    ): Promise<{
        success: boolean
        onboardingCompleted: boolean
        added: { projects: number; campaigns: number; clusters: number }
    }> {
        // Mark onboarding as completed
        userOnboardingStatus.set(userId, true)

        return {
            success: true,
            onboardingCompleted: true,
            added: {
                projects: data.projectIds?.length ?? 0,
                campaigns: data.campaignIds?.length ?? 0,
                clusters: data.clusterIds?.length ?? 0
            }
        }
    }
}
