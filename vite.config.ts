import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  if (mode === 'widget') {
    // Widget build configuration
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/widget/index.ts'),
          name: 'AlecChatBot',
          fileName: 'widget',
          formats: ['iife']
        },
        rollupOptions: {
          external: [],
          output: {
            globals: {}
          }
        },
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    };
  }

  // Development configuration
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});
