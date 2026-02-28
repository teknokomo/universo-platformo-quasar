import { createApp } from 'vue'
import { Quasar } from 'quasar'
import { createPinia } from 'pinia'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import App from './App.vue'
import { createRouter } from './router'
import { createI18n } from './boot/i18n'

const app = createApp(App)
const pinia = createPinia()
const router = createRouter()
const i18n = createI18n()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Quasar, {
    plugins: {}
})

app.mount('#app')
