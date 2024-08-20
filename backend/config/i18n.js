const i18n = require('i18next');
const Backend = require('i18next-node-fs-backend');
const middleware = require('i18next-express-middleware');

i18n
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/../locales/{{lng}}/translation.json'
        },
        fallbackLng: 'en',
        preload: ['en', 'es', 'fr'], // Add supported languages here
        saveMissing: true
    });

module.exports = i18n;
