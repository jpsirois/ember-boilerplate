/* eslint-env node */

'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const targets = require('./config/targets');

const buildFingerPrintPrepend = ({ASSETS_CDN_HOST, ASSETS_CDN_PROTOCOL, ASSETS_CDN_PATH}) => {
  if (!ASSETS_CDN_HOST || !ASSETS_CDN_PROTOCOL) return '';
  return `${ASSETS_CDN_PROTOCOL}://${ASSETS_CDN_HOST}/${ASSETS_CDN_PATH}`;
};

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    hinting: false,

    // Dependencies
    'ember-cli-webpack-imports': {
      expose: [
        'apollo-client',
        'apollo-link-context',
        'apollo-link-http',
        'apollo-cache-inmemory'
      ]
    },

    vendorFiles: {
      'jquery.js': null
    },

    // SCSS compilation
    autoprefixer: {
      browsers: targets.browsers
    },

    cssModules: {
      intermediateOutputPath: 'app/styles/app.scss',
      extension: 'scss',
      postcssOptions: {
        syntax: require('postcss-scss')
      }
    },

    // JavaScript compilation
    babel: {
      plugins: [
        'transform-object-rest-spread'
      ]
    },

    'ember-cli-babel': {
      includePolyfill: true
    },

    // Fingerprinting
    fingerprint: {
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'svg'],
      generateAssetMap: true,
      prepend: buildFingerPrintPrepend(process.env)
    },

    // Inline SVGs
    svg: {
      paths: [
        'public/assets/inline-svgs'
      ]
    }
  });

  app.import('node_modules/simple-css-reset/reset.css');

  return app.toTree();
};
