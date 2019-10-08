/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

// https://nextjs.org/docs#customizing-webpack-config

const fs = require('fs');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const withOffline = require('next-offline');

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './styles/antd-custom.less'), 'utf8')
);

const nextConfig = {
  // Now by ZEIT deployment target
  target: 'serverless',

  // custom webpack config for Ant Design Less
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables // make your antd custom effective
  },

  // https://github.com/hanford/next-offline#now-20
  // Add the homepage to the cache
  transformManifest: manifest => ['/'].concat(manifest),

  // PWA Doesn't work in Dev
  generateInDevMode: false,

  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200]
          },
          fetchOptions: {
            credentials: 'include'
          }
        }
      }
    ]
  },

  webpack: (config, options) => {
    config.plugins = config.plugins || [];

    // https://github.com/zeit/next.js/tree/canary/examples/with-dotenv
    config.plugins.push(
      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    );

    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    if (process.env.ANALYZE_BUILD) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true,
          reportFilename: options.isServer
            ? '../analyze/server.html'
            : './analyze/client.html'
        })
      );
    }

    // https://github.com/zeit/next.js/tree/canary/examples/with-ant-design-less
    if (options.isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals)
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader'
      });
    }

    return config;
  }
};

module.exports = withOffline(withLess(nextConfig));
// module.exports = withLess(nextConfig);
