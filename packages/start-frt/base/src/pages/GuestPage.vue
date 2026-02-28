<!--
 * GuestPage - Landing page for non-authenticated users
 *
 * Displays:
 * - Hero section with title and "Get started" button (centered vertically)
 * - Testimonials section (4 cards in 1 row, fixed to bottom)
 * - Footer with contact information
 *
 * Equivalent of GuestStartPage.tsx from the React implementation
-->
<template>
    <div class="guest-page">
        <!-- Background image overlay -->
        <div class="background-overlay"></div>

        <!-- Hero takes available space -->
        <div class="hero-container">
            <HeroSection />
        </div>

        <!-- Testimonials fixed to bottom -->
        <div class="testimonials-container">
            <TestimonialsSection />
        </div>

        <!-- Footer -->
        <StartFooter />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import StartFooter from '../components/StartFooter.vue'

export default defineComponent({
    name: 'GuestPage',
    components: {
        HeroSection,
        TestimonialsSection,
        StartFooter
    }
})
</script>

<style scoped lang="scss">
.guest-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-image: url('/background-image.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
}

.background-overlay {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(100, 181, 246, 0.4), transparent);
    pointer-events: none;
    z-index: 0;
}

.hero-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    z-index: 1;
    position: relative;
}

.testimonials-container {
    flex-shrink: 0;
    z-index: 1;
    position: relative;
}
</style>
