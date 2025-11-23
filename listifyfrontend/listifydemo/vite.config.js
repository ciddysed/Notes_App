import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    wasm(),
  ],

  // Ensure browser has a global object for crypto/libsodium/pbkdf2 libs
  define: {
    global: 'globalThis',
  },

  resolve: {
    alias: {
      '@emurgo/cardano-serialization-lib-nodejs':
        '@emurgo/cardano-serialization-lib-browser',

      '@emurgo/cardano-message-signing-nodejs':
        '@emurgo/cardano-message-signing-browser',

      '@': path.resolve(__dirname, 'src'),
    },
  },

  optimizeDeps: {
    include: [
      '@emurgo/cardano-serialization-lib-browser',
      '@emurgo/cardano-message-signing-browser',
      '@blaze-cardano/sdk',
      '@blaze-cardano/core',
      '@blaze-cardano/query',
    ],

    // ✔ IMPORTANT: allow top-level await during dependency optimization
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true,
      },
    },
  },

  build: {
    // ✔ THIS FIXES YOUR ERROR
    target: 'esnext',

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('@emurgo') ||
              id.includes('@blaze-cardano') ||
              id.includes('libsodium')
            ) {
              return 'cardano-vendor'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
