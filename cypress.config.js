const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  projectId: 'wizhg6',
  e2e: {
    baseUrl: "http://localhost:9090/",
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: false,
    video: true,
    setupNodeEvents(on, config) {
      // ativa o Allure
      allureWriter(on, config);

      // se quiser manter o Mochawesome também
      require('cypress-mochawesome-reporter/plugin')(on);

      return config;
    },
  },
  reporter: 'cypress-mochawesome-reporter', // opcional
});
