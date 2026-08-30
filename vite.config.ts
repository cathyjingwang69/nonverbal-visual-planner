import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Served from GitHub Pages at /nonverbal-visual-planner/
export default defineConfig({
  base: '/nonverbal-visual-planner/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Audrey — Communication Companion',
        short_name: 'Audrey',
        description: 'Contextual communication companion for nonspeaking and minimally speaking children.',
        theme_color: '#F6F5F0',
        background_color: '#F6F5F0',
        display: 'standalone',
        orientation: 'any',
        start_url: '/nonverbal-visual-planner/',
        scope: '/nonverbal-visual-planner/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/nonverbal-visual-planner/index.html',
      },
    }),
  ],
})
