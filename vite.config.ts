import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import autoImport from 'unplugin-auto-import/vite'
import icons from 'unplugin-icons/vite'
import iconsResolver from 'unplugin-icons/resolver'
import pages from 'vite-plugin-pages'
import solidPlugin from 'vite-plugin-solid'
import solidSvg from 'vite-plugin-solid-svg'

import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '/src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    solidPlugin(),

    solidSvg(),

    icons({ autoInstall: true, compiler: 'solid' }),

    autoImport({
      imports: ['solid-js', 'solid-app-router'],
      dts: './src/auto-imports.d.ts',
      resolvers: [
        iconsResolver({
          prefix: 'Icon',
          extension: 'jsx',
        }),
      ],
    }),

    pages({
      exclude: [
        '**/components/*',
        '**/components/**/*',
        '**/scripts/*',
        '**/scripts/**/*',
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer(), tailwindcss()],
    },
  },
})
