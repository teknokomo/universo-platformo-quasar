/**
 * Vue SFC type declarations
 */
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<object, object, any>
    export default component
}

/**
 * Vite environment variable types
 */
interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
