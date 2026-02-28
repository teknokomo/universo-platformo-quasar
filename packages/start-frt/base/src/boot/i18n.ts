/**
 * i18n boot file
 * Initializes vue-i18n with English and Russian translations
 */
import { createI18n as createVueI18n } from 'vue-i18n'
import enUS from '../i18n/en-US'
import ruRU from '../i18n/ru-RU'

export function createI18n() {
    return createVueI18n({
        locale: 'en-US',
        fallbackLocale: 'en-US',
        messages: {
            'en-US': enUS,
            'ru-RU': ruRU
        }
    })
}

export default createI18n
