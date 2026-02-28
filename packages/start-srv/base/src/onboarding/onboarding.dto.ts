/**
 * Onboarding DTOs
 * Data Transfer Objects for onboarding API
 */

export interface JoinItemsDto {
    projectIds: string[]
    campaignIds: string[]
    clusterIds: string[]
}

export interface OnboardingItem {
    id: string
    name: string
    description?: string
    isSelected: boolean
}

export interface OnboardingItemsResponse {
    projects: OnboardingItem[]
    campaigns: OnboardingItem[]
    clusters: OnboardingItem[]
    onboardingCompleted: boolean
}
