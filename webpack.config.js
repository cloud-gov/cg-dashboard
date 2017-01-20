const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackKarmaWarningsPlugin = require(
  './static_src/test/webpack-karma-warnings-plugin.js');

const PRODUCTION = (process.env.NODE_ENV === 'prod');
const TEST = (process.env.NODE_ENV === 'test');
const CG_STYLE_PATH = process.env.CG_STYLE_PATH;
const CF_SKIN = process.env.CF_SKIN || 'cg';

const srcDir = './static_src';
const compiledDir = './static/assets';

const config = {
  bail: true,

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
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-object-rest-spread', 'transform-runtime']
        }
      },
      {
        name: 'css',
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'static_src/css'),
          path.resolve(__dirname, 'node_modules/cloudgov-style'),
          CG_STYLE_PATH || ''
        ],
        loader: ExtractTextPlugin.extract('style-loader',
          'css-loader')
      },
      {
        test: /\.(svg|ico|png|gif|jpe?g)$/,
        loader: 'url-loader?limit=1024&name=img/[name].[ext]'
      },
      { test: /\.(ttf|woff2?|eot)$/,
        loader: 'url-loader?limit=1024&name=font/[name].[ext]'
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      }
    ]
  },

  resolve: {
    alias: {
      'cloudgov-style': 'cloudgov-style',
      'skin' : path.resolve(__dirname, `static_src/skins/${CF_SKIN}`)
    },

    modulesDirectories: ['node_modules']
  },

  resolveLoader: {
    fallback: path.resolve(__dirname, 'node_modules')
  },

  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true })
  ],

  publicPath: './static'
};

if (TEST) {
  config.plugins.push(new WebpackKarmaWarningsPlugin());
  config.externals = {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  };
}

if (PRODUCTION) {
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.plugins.push(new WebpackKarmaWarningsPlugin());
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }));
  const idx = config.module.loaders.findIndex((loader) => loader.name === 'css');
  config.module.loaders[idx].loader = (
    ExtractTextPlugin.extract('style-loader',
      'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
  );
}

module.exports = config;
