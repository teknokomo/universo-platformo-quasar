<!--
 * TestimonialsSection - Universo ecosystem product cards
 *
 * Displays 4 product cards in a grid:
 * - Universo Kompendio - Knowledge management
 * - Universo Platformo - Abstract management layer
 * - Universo Kiberplano - Planning and execution system
 * - Universo Grandaringo - Creative and media tools
 *
 * Equivalent of Testimonials.tsx from the React implementation
-->
<template>
    <div class="testimonials-section q-pa-md">
        <div class="row q-col-gutter-md justify-center">
            <div
                v-for="(product, index) in products"
                :key="index"
                class="col-12 col-sm-6 col-md-3"
            >
                <q-card bordered flat class="full-height">
                    <q-card-section>
                        <div class="text-subtitle1 text-weight-bold q-mb-sm">
                            <span class="text-primary">Universo</span>
                            {{ t(product.titleKey) }}
                        </div>
                        <div class="text-body2 text-grey-7">
                            {{ t(product.descriptionKey) }}
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
    name: 'TestimonialsSection',
    setup() {
        const { t } = useI18n()

        const products = [
            {
                titleKey: 'landing.testimonials.kompendio.title',
                descriptionKey: 'landing.testimonials.kompendio.description'
            },
            {
                titleKey: 'landing.testimonials.platformo.title',
                descriptionKey: 'landing.testimonials.platformo.description'
            },
            {
                titleKey: 'landing.testimonials.kiberplano.title',
                descriptionKey: 'landing.testimonials.kiberplano.description'
            },
            {
                titleKey: 'landing.testimonials.grandaringo.title',
                descriptionKey: 'landing.testimonials.grandaringo.description'
            }
        ]

        return { t, products }
    }
})
</script>

<style scoped lang="scss">
.testimonials-section {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
}
</style>
