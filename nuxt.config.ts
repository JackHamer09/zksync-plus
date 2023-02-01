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
          href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap",
        },
      ],
    },
  },
  modules: ["@kevinmarrec/nuxt-pwa"],
  ssr: false,
  pwa: {
    meta: {
      name: "zkSync Plus",
      description: "zkSync Plus - all in one wallet for zkSync",
    },
    manifest: {
      name: "zkSync Plus",
      short_name: "zkSync Plus",
    },
  },
  css: ["@/assets/css/tailwind.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {},
  },
});
