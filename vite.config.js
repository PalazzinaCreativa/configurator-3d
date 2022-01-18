const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  build: {
    minify: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'configurator',
      fileName: (format) => `configurator.${format}.js`
    },
    rollupOptions: {
      output: {
        compact: true
      }
    }
  }
})