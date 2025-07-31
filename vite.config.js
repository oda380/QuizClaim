// vite.config.js
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [ react(), visualizer({ /* … */ }) ],

// force Vite to pre-bundle wagmi’s context & hydrate in dev
  optimizeDeps: {
    include: [
      'wagmi/dist/esm/context.js',
      'wagmi/dist/esm/hydrate.js',
  ],
  },

  resolve: {
    alias: {
      // Redirect wagmi’s context.js & hydrate.js to your patched versions:
      'wagmi/dist/esm/context.js': path.resolve(__dirname, 'src/vendor/wagmi/context.js'),
      'wagmi/dist/esm/hydrate.js': path.resolve(__dirname, 'src/vendor/wagmi/hydrate.js'),
    },
    dedupe: ['react','react-dom'],
    mainFields: ['browser','module','main'],
  },

  build: {
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      requireReturnsDefault: 'auto',
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          /* … your manualChunks … */
        },
      },
    },
  },
});
