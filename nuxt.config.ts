// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },
  plugins: [],
  modules: ["@kevinmarrec/nuxt-pwa", "@pinia/nuxt"],
  ssr: false,
  pwa: {
    meta: {
      name: "zkSync Plus",
      description: "All in one wallet for zkSync Era∎ and zkSync Lite",
    },
    manifest: {
      name: "zkSync Plus",
      short_name: "zkPlus",
    },
  },
  css: ["@/assets/css/tailwind.css", "web3-avatar-vue/dist/style.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      walletConnectProjectID: process.env.WALLET_CONNECT_PROJECT_ID,
    },
  },
});
