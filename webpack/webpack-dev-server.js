const postcssFlexbugs = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const baseDir = path.resolve(__dirname, '..');

require('dotenv').config();

const USE_SSL = process.env.SERVER_SSL_CERT && process.env.SERVER_SSL_KEY;
let STEEMCONNECT_REDIRECT_URL = process.env.STEEMCONNECT_REDIRECT_URL;
let HEDE_API = process.env.HEDE_API;

if (!STEEMCONNECT_REDIRECT_URL) {
  if (USE_SSL) {
    STEEMCONNECT_REDIRECT_URL = 'https://localhost:3000/callback';
    HEDE_API = 'https://localhost:4040/api/';
    HEDE_GITHUB_REDIRECT_URL = 'https://localhost:3000/github/callback';
  } else {
    STEEMCONNECT_REDIRECT_URL = 'http://localhost:3000/callback';
    HEDE_API = 'http://localhost:4040/api/';
    HEDE_GITHUB_REDIRECT_URL = 'http://localhost:3000/github/callback';
  }
}

module.exports = {
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: path.resolve(baseDir, './src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(baseDir, 'dist'),
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  plugins: [
    new HardSourceWebpackPlugin({
      // Either false, a string, an object, or a project hashing function.
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock'],
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        IMG_HOST: JSON.stringify(process.env.IMG_HOST || 'https://img.busy.org'),
        SENTRY_PUBLIC_DSN: null,
        STEEMCONNECT_HOST: JSON.stringify(process.env.STEEMCONNECT_HOST || 'https://v2.steemconnect.com'),
        STEEMCONNECT_REDIRECT_URL: JSON.stringify(STEEMCONNECT_REDIRECT_URL),
        STEEM_NODE: JSON.stringify(process.env.STEEM_NODE || 'https://api.steemit.com'),
        SERVER_SSL_CERT: JSON.stringify(process.env.SERVER_SSL_CERT),
        SERVER_SSL_KEY: JSON.stringify(process.env.SERVER_SSL_KEY),
        HEDE_STEEM_ACCOUNT: JSON.stringify(process.env.HEDE_STEEM_ACCOUNT || 'hede-io'),
        HEDE_CATEGORY: JSON.stringify(process.env.HEDE_CATEGORY || 'test-category'),
        HEDE_LANDING_URL: JSON.stringify(process.env.HEDE_LANDING_URL || 'http://join.hede.io'),
        HEDE_API: JSON.stringify(HEDE_API),
        STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'wss://steemd-int.steemit.com'),
        IS_BROWSER: JSON.stringify(true),
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true, //important for performance
         }
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/,
        loader: 'url-loader',
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [
                postcssFlexbugs,
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                }),
              ],
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  devServer: {
    https: !!USE_SSL,
    cert: USE_SSL ? fs.readFileSync(process.env.SERVER_SSL_CERT) : undefined,
    key: USE_SSL ? fs.readFileSync(process.env.SERVER_SSL_KEY) : undefined,
    port: 3000,
    contentBase: path.resolve(baseDir, 'dist'),
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy: {
      '/callback': {
        target: USE_SSL ? 'https://localhost:3001' : 'http://localhost:3001',
        secure: false
      }
    }
  }
};
