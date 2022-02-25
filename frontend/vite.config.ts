import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import tailwindcss from "tailwindcss"
import tailwindConfig from './tailwind.config.js'
import autoprefixer from "autoprefixer"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({
    preprocess: sveltePreprocess({
      sourceMap: false,
      postcss: {
        plugins: [tailwindcss(tailwindConfig), autoprefixer()],
      }
    })
  })],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001/",
        changeOrigin: true,
      }
    }
  }
})
