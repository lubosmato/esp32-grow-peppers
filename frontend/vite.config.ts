import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from "svelte-preprocess"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({
    preprocess: sveltePreprocess()
  })],
  server: {
    // proxy: {
    //   "/api": {
    //     target: "https://grow.lubosmatejcik.cz/",
    //     changeOrigin: true,
    //     ws: true,
    //   }
    // }
    proxy: {
      "/api": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        ws: true,
      }
    }
  }
})
