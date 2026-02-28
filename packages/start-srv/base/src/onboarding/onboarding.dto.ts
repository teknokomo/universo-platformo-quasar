/**
 * Onboarding DTOs
 * Data Transfer Objects for onboarding API.
 * Uses class-validator for runtime input validation.
 */
import { IsArray, IsUUID, ArrayMaxSize } from 'class-validator'
import { Transform } from 'class-transformer'

/** Maximum number of IDs accepted per category */
const MAX_IDS_PER_CATEGORY = 100

export class JoinItemsDto {
    @IsArray()
    @IsUUID('4', { each: true })
    @ArrayMaxSize(MAX_IDS_PER_CATEGORY)
    @Transform(({ value }: { value: string[] }) => [...new Set<string>(value)])
    projectIds!: string[]

    @IsArray()
    @IsUUID('4', { each: true })
    @ArrayMaxSize(MAX_IDS_PER_CATEGORY)
    @Transform(({ value }: { value: string[] }) => [...new Set<string>(value)])
    campaignIds!: string[]

    @IsArray()
    @IsUUID('4', { each: true })
    @ArrayMaxSize(MAX_IDS_PER_CATEGORY)
    @Transform(({ value }: { value: string[] }) => [...new Set<string>(value)])
    clusterIds!: string[]
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
