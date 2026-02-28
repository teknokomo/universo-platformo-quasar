/**
 * Vue Router routes configuration
 * Defines all application routes with auth guards
 */
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('../pages/StartPage.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/auth',
        component: () => import('../pages/AuthPage.vue'),
        meta: { requiresAuth: false }
    },
    // Catch-all 404
    {
        path: '/:catchAll(.*)*',
        redirect: '/'
    }
]

export default routes
