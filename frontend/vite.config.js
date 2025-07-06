import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          ['@babel/preset-react', {
            runtime: 'automatic',
            importSource: '@emotion/react',
          }]
        ],
        plugins: ['@emotion/babel-plugin'],
      },
      include: /\.(js)$/,
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
    jsx: 'automatic',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});