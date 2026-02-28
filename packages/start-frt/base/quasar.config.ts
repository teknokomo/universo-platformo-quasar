import { configure } from 'quasar/wrappers'

export default configure(function (/* ctx */) {
    return {
        boot: ['i18n', 'supabase'],

        css: ['app.scss'],

        extras: ['roboto-font', 'material-icons'],

        build: {
            target: {
                browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
                node: 'node20'
            },
            vueRouterMode: 'history',
            typescript: {
                strict: true,
                vueShim: true
            }
        },

        devServer: {
            open: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true
                }
            }
        },

        framework: {
            config: {},
            plugins: ['Notify', 'Loading', 'Dialog']
        },

        animations: [],

        ssr: {
            pwa: false,
            prodPort: 3000,
            middlewares: ['render']
        },

        pwa: {
            workboxMode: 'generateSW'
        },

        cordova: {},

        capacitor: {
            hideSplashscreen: true
        },

        electron: {
            inspectPort: 5858,
            bundler: 'packager',
            packager: {},
            builder: {
                appId: 'universo-platformo-start'
            }
        },

        bex: {
            contentScripts: ['my-content-script']
        }
    }
})
