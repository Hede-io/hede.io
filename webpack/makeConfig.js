/* eslint-disable global-require */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//var CompressionPlugin = require('compression-webpack-plugin');
var BrotliGzipPlugin = require('brotli-gzip-webpack-plugin');

require('dotenv').config();

const DEFAULTS = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  baseDir: path.resolve(__dirname, '..'),
};

let HEDE_LANDING_URL = process.env.HEDE_LANDING_URL;
if (!DEFAULTS.isDevelopment && HEDE_LANDING_URL === undefined) {
  HEDE_LANDING_URL = 'http://join.hede.io';
}

const POSTCSS_LOADER = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
    plugins: () => [
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
};

function isVendor({ resource }) {
  return resource &&
    resource.indexOf('node_modules') >= 0 &&
    resource.match(/\.jsx?$/);
}

function makePlugins(options) {
  const isDevelopment = options.isDevelopment;

  let plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: isDevelopment ? JSON.stringify('development') : JSON.stringify('production'),
        ENABLE_LOGGER: JSON.stringify(process.env.ENABLE_LOGGER),
        IMG_HOST: JSON.stringify(process.env.IMG_HOST || 'https://img.busy.org'),
        SENTRY_PUBLIC_DSN: isDevelopment ? null : JSON.stringify(process.env.SENTRY_PUBLIC_DSN),
        STEEMCONNECT_HOST: JSON.stringify(process.env.STEEMCONNECT_HOST || 'https://v2.steemconnect.com'),
        STEEMCONNECT_REDIRECT_URL: JSON.stringify(process.env.STEEMCONNECT_REDIRECT_URL || 'https://hede.io/callback'),
        STEEMJS_URL: JSON.stringify(process.env.STEEMJS_URL || 'https://api.steemit.com'),
        STEEM_NODE: JSON.stringify(process.env.STEEM_NODE || isDevelopment? 'https://testnet.steem.vc':'https://api.steemit.com'),
        HEDE_CATEGORY: JSON.stringify(process.env.HEDE_CATEGORY || 'test-category'),
        HEDE_STEEM_ACCOUNT: JSON.stringify(process.env.HEDE_STEEM_ACCOUNT || 'hede-io'),
        HEDE_LANDING_URL: JSON.stringify(HEDE_LANDING_URL),
        HEDE_API: JSON.stringify(process.env.HEDE_API || 'https://localhost:4040/api/'),
        HEDE_DOMAIN: JSON.stringify(process.env.HEDE_DOMAIN || 'hede.io'),
        DEFAULT_CATEGORY: JSON.stringify('entry'),
        IS_BROWSER: JSON.stringify(true),
      },
    }),
    new LodashModuleReplacementPlugin({
      collections: true,
      paths: true,
      shorthands: true,
      flattening: true,
    }),
    new Visualizer({
      filename: './statistics.html',
    }),
  ];

  if (isDevelopment) {
    plugins = plugins.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ]);
  } else {
    plugins = plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        sourceMap: false,
        comments: false,
        warnings: true,
        mangle: {
          screw_ie8: true
        }, 
        compress: {
          screw_ie8: true,
          warnings: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          negate_iife: false
        },
        output: {
          comments: false,
          beautify: false,
        },
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks(module) {
          // this assumes your vendor imports exist in the node_modules directory
          return isVendor(module);
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
      /*new CompressionPlugin({  
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }),*/
      new BrotliGzipPlugin({
        asset: '[path].br[query]',
        algorithm: 'brotli',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new BrotliGzipPlugin({
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8
      }),
      new ExtractTextPlugin({
        allChunks: true,
        filename: '../css/style.[contenthash].css',
      }),    
      new HtmlWebpackPlugin({
        title: 'Hede',
        filename: '../index.html',
        template: path.join(options.baseDir, '/templates/index.html'),
      }),
     
    ]);
  }

  return plugins;
}

function makeStyleLoaders(options) {
  if (options.isDevelopment) {
    return [
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          POSTCSS_LOADER,
          {
            loader: 'less-loader',
          },
        ],
      },
    ];
  }

  return [
    {
      test: /\.(css|less)$/,
      loader: ExtractTextPlugin.extract({
        //fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: false,
              importLoaders: 1,
            },
          },
          POSTCSS_LOADER,
          {
            loader: 'less-loader',
          },
        ],
      }),
    },
  ];
}

function makeConfig(options = {}) {
  _.defaults(options, DEFAULTS);

  const isDevelopment = options.isDevelopment;

  return {
    devtool: isDevelopment ? 'eval-source-map' : false,
    entry: {
      main: (isDevelopment ? [
        'webpack-hot-middleware/client?reload=true',
        'react-hot-loader/patch',
        // activate HMR for React
        'webpack/hot/only-dev-server',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
      ] : []).concat([
        path.join(options.baseDir, 'src/index.js')]
      ),
    },
    output: {
      path: path.join(options.baseDir, '/public/js'),
      filename: options.isDevelopment ? 'hede-[name].js' : 'hede-[name].[chunkhash].js',
      publicPath: '/js/',
    },
    plugins: makePlugins(options),
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: (options.isDevelopment ? [{ loader: 'react-hot-loader/webpack' }] : []).concat(
            [
              {
                loader: 'babel-loader',
              }
            ]
          )
        },
        {
          test: /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/,
          loader: 'url-loader',
          options: {
            name: '../fonts/[name].[ext]',
            // load fonts through data-url in development
            limit: options.isDevelopment ? 5000000 : 1,
          },
        },
        {
          test: /\.png$/,
          loader: 'file-loader',
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          options: {
            removeComments: false,
          },
        },
      ].concat(makeStyleLoaders(options)),
    },
  };
}

if (!module.parent) {
  console.log(makeConfig({
    isDevelopment: process.env.NODE_ENV !== 'production',
  }));
}

exports = module.exports = makeConfig;
exports.DEFAULTS = DEFAULTS;
exports.POSTCSS_LOADER = POSTCSS_LOADER;
exports.makeStyleLoaders = makeStyleLoaders;
