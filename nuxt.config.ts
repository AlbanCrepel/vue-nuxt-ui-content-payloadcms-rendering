// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {compatibilityVersion: 4},
  devtools: { enabled: true },

  modules: ['@nuxtjs/mdc'],

  runtimeConfig: {
    public: {
      payloadEndpoint: process.env.PAYLOAD_ENDPOINT || 'http://localhost:3001',
    }
  }
})
