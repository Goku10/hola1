import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    {
      name: 'strip-legacy-html',
      transformIndexHtml(html) {
        return html.replace(/<!-- Previous static application[\s\S]*?-->/, '')
      },
    },
    react(),
    tailwindcss(),
  ],
  base: './',
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
})
