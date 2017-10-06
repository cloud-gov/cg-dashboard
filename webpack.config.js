const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = (process.env.NODE_ENV === 'prod');
const TEST = (process.env.NODE_ENV === 'test');
const CG_STYLE_PATH = process.env.CG_STYLE_PATH;

process.env.SKIN_NAME = process.env.SKIN_NAME || 'cg';

const srcDir = './static_src';
const compiledDir = './static/assets';

const config = {
  bail: false,

  entry: [
    'babel-polyfill',
    `${srcDir}/main.js`
  ],

  output: {
    path: path.resolve(compiledDir),
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map'
  },

  devtool: PRODUCTION ? 'cheap-source-map' : 'eval-source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
          plugins: ['transform-object-rest-spread', 'transform-runtime']
        },
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(svg|ico|png|gif|jpe?g)$/,
        loader: 'url-loader?limit=1024&name=img/[name].[ext]'
      },
      { test: /\.(ttf|woff2?|eot)$/,
        loader: 'url-loader?limit=1024&name=font/[name].[ext]'
      }
    ]
  },

  resolve: {
    symlinks: false,

    alias: {
      'cloudgov-style': 'cloudgov-style',
      skin: path.resolve(__dirname, `static_src/skins/${process.env.SKIN_NAME}`)
    },

    modules: ['node_modules'],
    // Required for some module configs which use these fields
    // See https://github.com/flatiron/director/issues/349
    mainFields: ['browserify', 'browser', 'module', 'main']
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: false,
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        context: __dirname
      }
    })
  ]
};

if (TEST) {
  config.externals = {
    cheerio: 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  };
}

const processEnv = {
  SKIN_NAME: JSON.stringify(process.env.SKIN_NAME),
  SKIN_PROVIDES_TRANSLATIONS: process.env.SKIN_PROVIDES_TRANSLATIONS
};

if (PRODUCTION) {
  processEnv.NODE_ENV = JSON.stringify('production');
}

config.plugins.push(new webpack.DefinePlugin({
  'process.env': processEnv
}));

module.exports = config;
