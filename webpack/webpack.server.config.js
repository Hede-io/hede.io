const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';
const baseDir = path.resolve(__dirname, '..');

require('dotenv').config();

module.exports = {
  devtool: 'eval-source-map',

  entry: path.resolve(baseDir, './server/index.js'),
  resolve: {
    extensions: ['.jsx', '.js', '.ts']
  },
  output: {
    filename: 'hede.server.js',
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(baseDir, 'node_modules'))
    .concat([
      'react-dom/server', 'react/addons',
    ]).reduce((ext, mod) => {
      ext[mod] = `commonjs ${mod}`; // eslint-disable-line
      return ext;
    }, {}),

  node: {
    __filename: true,
    __dirname: true,
  },
  watch: isDevelopment,

  module: {
    loaders: [
      {
        test: /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/,
        loader: 'url-loader',
        options: {
          name: '../fonts/[name].[ext]',
          limit: isDevelopment ? 500000 : 1,
        },
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-2'],
            plugins: ['transform-decorators-legacy', 'transform-runtime'],
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: [
          'isomorphic-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('autoprefixer')({
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        IMG_HOST: JSON.stringify(process.env.IMG_HOST || 'https://img.busy.org'),
        STEEMCONNECT_HOST: JSON.stringify(process.env.STEEMCONNECT_HOST || 'https://v2.steemconnect.com'),
        STEEMCONNECT_REDIRECT_URL: JSON.stringify(isDevelopment? "http://localhost:8080/callback" : 'https://hede.io/callback'),
        STEEM_NODE: JSON.stringify(process.env.STEEM_NODE || 'https://api.steemit.com'),
        STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'https://api.steemit.com'),
        SERVER_SSL_CERT: JSON.stringify(process.env.SERVER_SSL_CERT),
        SERVER_SSL_KEY: JSON.stringify(process.env.SERVER_SSL_KEY),
        HEDE_CATEGORY: JSON.stringify(process.env.HEDE_CATEGORY || 'test-category'),
        HEDE_LANDING_URL: JSON.stringify(process.env.HEDE_LANDING_URL || 'http://join.hede.io'),
        HEDE_API: JSON.stringify(process.env.HEDE_API || 'http://localhost:4040/api/'),
        HEDE_STEEM_ACCOUNT: JSON.stringify(process.env.HEDE_STEEM_ACCOUNT || 'hede'),
        STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'wss://steemd-int.steemit.com'),
        IS_BROWSER: JSON.stringify(false),
        HEDE_CATEGORY: JSON.stringify(process.env.HEDE_CATEGORY || 'test-category'),
        HEDE_DOMAIN: JSON.stringify(process.env.HEDE_DOMAIN || 'hede.io'),
        HEDE_ENTRIES_ACCOUNT: JSON.stringify(process.env.HEDE_ENTRIES_ACCOUNT || 'hede-entries'),
        HEDE_ENTRIES_TAG: JSON.stringify(process.env.HEDE_ENTRIES_TAG || 'hede-entries'),
        HEDE_ENTRIES_WITH_STEEM_COMMENTS_ENABLED: JSON.stringify(process.env.HEDE_ENTRIES_WITH_STEEM_COMMENTS_ENABLED || false),
        DEFAULT_CATEGORY: JSON.stringify('entry'),
      },
    }),
  ],

};
