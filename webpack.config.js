var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var srcDir = './static_src';
var compiledDir = './static/assets';

module.exports = {
  entry: srcDir + '/main.js',

  output: {
    path: path.resolve(compiledDir),
    filename: 'bundle.js'
  },


  module: {
    loaders: [
      { test: /\.jsx?$/,
        loader: 'babel?optional[]=runtime',
        exclude: /node_modules/ },
      { test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },

  resolve: {
    modulesDirectories: ['node_modules', 'components']
  },

  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true })
  ]
};
