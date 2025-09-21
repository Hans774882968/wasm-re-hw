import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { getWebsiteBasePath } from './src/lib/routeUtils';

// https://vite.dev/config/
export default defineConfig(() => {
  const basePath = getWebsiteBasePath();
  const isGitHubPages = import.meta.env.VITE_DEPLOY_TARGET === 'github-pages';
  const buildOptions = isGitHubPages ? {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        '404': '404.html',
      },
    },
  } : {};

  console.log(`[wasm-re-ui] Base path: ${basePath}`);

  return {
    base: basePath,
    build: buildOptions,
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5220,
    },
  };
});
