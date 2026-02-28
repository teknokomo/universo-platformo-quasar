<!--
 * StartFooter - Footer with contact information
 *
 * Equivalent of StartFooter.tsx from the React implementation
-->
<template>
    <footer class="start-footer q-pa-md text-center">
        <div class="text-caption text-grey-6">
            <q-btn flat dense no-caps :label="t('footer.contact')" class="q-mr-sm" size="sm" />
            <q-btn flat dense no-caps :label="t('footer.privacy')" class="q-mr-sm" size="sm" />
            <q-btn flat dense no-caps :label="t('footer.terms')" size="sm" />
        </div>
        <div class="text-caption text-grey-5 q-mt-xs">
            &copy; {{ currentYear }} Universo Platformo
        </div>
    </footer>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
    name: 'StartFooter',
    setup() {
        const { t } = useI18n()
        const currentYear = computed(() => new Date().getFullYear())
        return { t, currentYear }
    }
})
</script>

<style scoped lang="scss">
.start-footer {
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
