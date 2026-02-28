<!--
 * HeroSection - Landing page hero section
 *
 * Displays:
 * - Main heading with highlighted "all worlds" text
 * - Subtitle describing the platform
 * - "Get started" button linking to auth page
 *
 * Equivalent of Hero.tsx from the React implementation
-->
<template>
    <div class="hero-section flex flex-center column q-pa-xl">
        <div class="text-center" style="max-width: 700px">
            <h1 class="hero-title text-h2 text-weight-bold q-mb-md">
                {{ t('landing.hero.titlePrefix') }}&nbsp;
                <span class="text-primary">{{ t('landing.hero.titleHighlight') }}</span>
            </h1>
            <p class="hero-description text-body1 text-grey-7 q-mb-xl">
                {{ t('landing.hero.description') }}
            </p>
            <q-btn
                :to="'/auth'"
                color="primary"
                size="lg"
                :label="t('landing.hero.button')"
                class="hero-btn shadow-4"
                unelevated
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
    name: 'HeroSection',
    setup() {
        const { t } = useI18n()
        return { t }
    }
})
</script>

<style scoped lang="scss">
.hero-section {
    flex: 1;
    min-height: 60vh;
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: clamp(2.5rem, 8vw, 3.5rem);
    line-height: 1.2;
}

.hero-description {
    font-size: 1.15rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    max-width: 600px;
    margin: 0 auto;
}

.hero-btn {
    min-width: fit-content;
}
</style>
