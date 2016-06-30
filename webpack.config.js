
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CG_STYLE_PATH = process.env.CG_STYLE_PATH;

const srcDir = './static_src';
const compiledDir = './static/assets';

module.exports = {
  entry: [
    'babel-polyfill',
    `${srcDir}/main.js`
  ],

  output: {
    path: path.resolve(compiledDir),
    filename: 'bundle.js'
  },

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
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'static_src/css'),
          path.resolve(__dirname, 'node_modules/cloudgov-style'),
          CG_STYLE_PATH || ''
        ],
        loader: ExtractTextPlugin.extract('style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
      },
      {
        test: /\.(svg|png|jpe?g)$/,
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
      'cloudgov-style': 'cloudgov-style'
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
