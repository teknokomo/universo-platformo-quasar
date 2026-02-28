<!--
 * OnboardingWizard - Multi-step onboarding wizard for new authenticated users
 *
 * Allows users to select:
 * - Projects (Global Goals)
 * - Campaigns (Personal Interests)
 * - Clusters (Platform Features)
 *
 * Equivalent of OnboardingWizard.tsx from the React implementation
-->
<template>
    <div class="onboarding-wizard q-pa-lg">
        <div class="text-center q-mb-xl">
            <h2 class="text-h4 text-weight-bold q-mb-sm">{{ t('onboarding.title') }}</h2>
            <p class="text-body1 text-grey-7">{{ t('onboarding.subtitle') }}</p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex flex-center q-pa-xl">
            <q-spinner size="50px" color="primary" />
        </div>

        <!-- Onboarding content -->
        <div v-else>
            <!-- Projects section -->
            <div v-if="items?.projects?.length" class="q-mb-xl">
                <h3 class="text-h6 text-weight-bold q-mb-xs">{{ t('onboarding.projects.title') }}</h3>
                <p class="text-caption text-grey-7 q-mb-md">{{ t('onboarding.projects.description') }}</p>
                <div class="row q-col-gutter-sm">
                    <div
                        v-for="project in items.projects"
                        :key="project.id"
                        class="col-12 col-sm-6 col-md-4"
                    >
                        <q-card
                            bordered
                            flat
                            :class="['selectable-card', { 'selected': selectedProjects.has(project.id) }]"
                            @click="toggleProject(project.id)"
                            clickable
                        >
                            <q-card-section class="row items-center q-pa-md">
                                <q-checkbox
                                    v-model="selectedProjectsModel"
                                    :val="project.id"
                                    color="primary"
                                    class="q-mr-sm"
                                    @click.stop
                                />
                                <div>
                                    <div class="text-subtitle2 text-weight-bold">{{ project.name }}</div>
                                    <div v-if="project.description" class="text-caption text-grey-7">{{ project.description }}</div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>

            <!-- Campaigns section -->
            <div v-if="items?.campaigns?.length" class="q-mb-xl">
                <h3 class="text-h6 text-weight-bold q-mb-xs">{{ t('onboarding.campaigns.title') }}</h3>
                <p class="text-caption text-grey-7 q-mb-md">{{ t('onboarding.campaigns.description') }}</p>
                <div class="row q-col-gutter-sm">
                    <div
                        v-for="campaign in items.campaigns"
                        :key="campaign.id"
                        class="col-12 col-sm-6 col-md-4"
                    >
                        <q-card
                            bordered
                            flat
                            :class="['selectable-card', { 'selected': selectedCampaigns.has(campaign.id) }]"
                            @click="toggleCampaign(campaign.id)"
                            clickable
                        >
                            <q-card-section class="row items-center q-pa-md">
                                <q-checkbox
                                    v-model="selectedCampaignsModel"
                                    :val="campaign.id"
                                    color="primary"
                                    class="q-mr-sm"
                                    @click.stop
                                />
                                <div>
                                    <div class="text-subtitle2 text-weight-bold">{{ campaign.name }}</div>
                                    <div v-if="campaign.description" class="text-caption text-grey-7">{{ campaign.description }}</div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>

            <!-- Clusters section -->
            <div v-if="items?.clusters?.length" class="q-mb-xl">
                <h3 class="text-h6 text-weight-bold q-mb-xs">{{ t('onboarding.clusters.title') }}</h3>
                <p class="text-caption text-grey-7 q-mb-md">{{ t('onboarding.clusters.description') }}</p>
                <div class="row q-col-gutter-sm">
                    <div
                        v-for="cluster in items.clusters"
                        :key="cluster.id"
                        class="col-12 col-sm-6 col-md-4"
                    >
                        <q-card
                            bordered
                            flat
                            :class="['selectable-card', { 'selected': selectedClusters.has(cluster.id) }]"
                            @click="toggleCluster(cluster.id)"
                            clickable
                        >
                            <q-card-section class="row items-center q-pa-md">
                                <q-checkbox
                                    v-model="selectedClustersModel"
                                    :val="cluster.id"
                                    color="primary"
                                    class="q-mr-sm"
                                    @click.stop
                                />
                                <div>
                                    <div class="text-subtitle2 text-weight-bold">{{ cluster.name }}</div>
                                    <div v-if="cluster.description" class="text-caption text-grey-7">{{ cluster.description }}</div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>

            <!-- Empty state when no items available -->
            <div v-if="!items?.projects?.length && !items?.campaigns?.length && !items?.clusters?.length" class="text-center q-pa-xl text-grey-6">
                <q-icon name="explore" size="4rem" class="q-mb-md" />
                <p class="text-body1">{{ t('onboarding.emptyState') }}</p>
            </div>

            <!-- Complete button -->
            <div class="text-center q-mt-xl">
                <q-btn
                    color="primary"
                    size="lg"
                    :label="t('onboarding.completeButton')"
                    :loading="submitting"
                    @click="handleComplete"
                    unelevated
                    class="shadow-2"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOnboarding } from '../composables/useOnboarding'

export default defineComponent({
    name: 'OnboardingWizard',
    emits: ['complete'],
    setup(_, { emit }) {
        const { t } = useI18n()
        const { items, loading, fetchItems, joinItems } = useOnboarding()

        const submitting = ref(false)
        const selectedProjects = ref(new Set<string>())
        const selectedCampaigns = ref(new Set<string>())
        const selectedClusters = ref(new Set<string>())

        // v-model arrays for q-checkbox
        const selectedProjectsModel = computed({
            get: () => Array.from(selectedProjects.value),
            set: (val: string[]) => {
                selectedProjects.value = new Set(val)
            }
        })

        const selectedCampaignsModel = computed({
            get: () => Array.from(selectedCampaigns.value),
            set: (val: string[]) => {
                selectedCampaigns.value = new Set(val)
            }
        })

        const selectedClustersModel = computed({
            get: () => Array.from(selectedClusters.value),
            set: (val: string[]) => {
                selectedClusters.value = new Set(val)
            }
        })

        const toggleProject = (id: string) => {
            if (selectedProjects.value.has(id)) {
                selectedProjects.value.delete(id)
            } else {
                selectedProjects.value.add(id)
            }
        }

        const toggleCampaign = (id: string) => {
            if (selectedCampaigns.value.has(id)) {
                selectedCampaigns.value.delete(id)
            } else {
                selectedCampaigns.value.add(id)
            }
        }

        const toggleCluster = (id: string) => {
            if (selectedClusters.value.has(id)) {
                selectedClusters.value.delete(id)
            } else {
                selectedClusters.value.add(id)
            }
        }

        const handleComplete = async () => {
            submitting.value = true
            try {
                await joinItems({
                    projectIds: Array.from(selectedProjects.value),
                    campaignIds: Array.from(selectedCampaigns.value),
                    clusterIds: Array.from(selectedClusters.value)
                })
                emit('complete')
            } catch {
                // Error already handled in useOnboarding
            } finally {
                submitting.value = false
            }
        }

        onMounted(() => {
            fetchItems()
        })

        return {
            t,
            items,
            loading,
            submitting,
            selectedProjects,
            selectedCampaigns,
            selectedClusters,
            selectedProjectsModel,
            selectedCampaignsModel,
            selectedClustersModel,
            toggleProject,
            toggleCampaign,
            toggleCluster,
            handleComplete
        }
    }
})
</script>

<style scoped lang="scss">
.onboarding-wizard {
    max-width: 900px;
    margin: 0 auto;
}

.selectable-card {
    cursor: pointer;
    transition: border-color 0.2s, background-color 0.2s;

    &:hover {
        border-color: $primary;
        background-color: rgba($primary, 0.04);
    }

    &.selected {
        border-color: $primary;
        background-color: rgba($primary, 0.08);
    }
}
</style>
