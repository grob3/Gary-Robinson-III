import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// Plugin to remove import map from production builds
function removeImportMap(): Plugin {
  return {
    name: 'remove-import-map',
    transformIndexHtml(html) {
      // Remove import map script in production builds
      if (process.env.NODE_ENV === 'production' || process.argv.includes('build')) {
        return html.replace(/<script type="importmap">[\s\S]*?<\/script>\s*/g, '');
      }
      return html;
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
      },
      plugins: [react(), removeImportMap()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.HYGRAPH_ENDPOINT': JSON.stringify(env.HYGRAPH_ENDPOINT),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
