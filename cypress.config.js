const vitePreprocessor = require('cypress-vite');


const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'yp82ef',

  e2e: {
    baseUrl: 'http://localhost:5173',
    async setupNodeEvents(on) {
      on('file:preprocessor', vitePreprocessor());
    },
    specPattern: 'cypress/{e2e,staging}/**/*.test.ts',

  },
})