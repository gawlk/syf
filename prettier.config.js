module.exports = {
  // Base
  semi: false,
  singleQuote: true,

  // Vue
  vueIndentScriptAndStyle: true,

  // Imports
  importOrder: [
    // Libraries

    // CSS
    '.css',

    // Scripts
    '^/src/locales(.*)',
    '^/src/store(.*)',
    '^/src/scripts(.*)',
    '^./scripts(.*)',
    '^./[a-zA-Z0-9]+$',

    // Components
    '^@headlessui(.*)',
    '^~icons/(.*)',
    '^/src/components(.*)',
    '^./components(.*)',
    '(.*).vue$',

    // Assets
    '^/src/assets(.*)',
    '^./assets(.*)',

    // Else
    '^[./](.*)',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  // Plugins
  plugins: [
    require.resolve('@trivago/prettier-plugin-sort-imports'),
    require('prettier-plugin-tailwindcss'),
  ],
  pluginSearchDirs: false,
}
