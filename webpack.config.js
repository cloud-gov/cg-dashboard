var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var srcDir = './static_src';
var compiledDir = './static/assets';

module.exports = {
  entry: [
    'babel-polyfill',
    srcDir + '/main.js'
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
          path.resolve(__dirname, 'node_modules'),
        ],
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: []
        }
      },
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      { test: /\.(woff|woff2)$/,  
        loader: 'url-loader?limit=10000&mimetype=application/font-woff' 
      },
      { test: /\.ttf$/,    loader: 'file-loader' },
      { test: /\.eot$/,    loader: 'file-loader' },
      { test: /\.svg$/,    loader: 'file-loader' }
    ]
  },

  resolve: {
    modulesDirectories: ['node_modules', 'components']
  },

  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true })
  ]
};
