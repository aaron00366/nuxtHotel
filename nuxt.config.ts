// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '@/assets/scss/all.scss'
  ],
  postcss: { // CSS 屬性加上瀏覽器相容性前綴
    plugins: {
        autoprefixer: true
    }
  },
  modules: ["@pinia/nuxt",
    'pinia-plugin-persistedstate/nuxt',],
  plugins: [
    '~/plugins/vue-loading-overlay.client.js'
  ],
  app:{
    head: {
      title: 'Enjoyment Luxury Hotel - 享樂酒店',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: '享樂酒店' },
        { name: 'keywords', content: '酒店, 享樂, 住宿, 旅遊' },
        { name: 'author', content: '享樂酒店' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: '享樂酒店' },
        { property: 'og:description', content: '享樂酒店提供最舒適的住宿體驗' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.example.com' },
        { property: 'og:image', content: '../nuxtHotel/assets/images/home-about.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: '享樂酒店' },
        { name: 'twitter:description', content: '享樂酒店提供最舒適的住宿體驗' },
        { name: 'twitter:image', content: '../nuxtHotel/assets/images/home-about.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ]
    },
  }
})
