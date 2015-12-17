var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var srcDir = './static_src';
var compiledDir = './static/assets';

module.exports = {
  entry: [
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
          presets: ['es2015', 'react'],
          plugins: ['transform-runtime']
        }
      },
      { test: /\.css$/, 
        include: path.resolve(__dirname, 'static_src/css'),
        loader: ExtractTextPlugin.extract('style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') 
      },
      { test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      { test: /\.css$/,
        include: path.resolve(__dirname, 'node_modules'),
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
    alias: {
      'bootstrap.css':  __dirname + '/node_modules/bootstrap/dist/css/bootstrap.css',
      'bootstrap.less': __dirname + '/node_modules/bootstrap/less/bootstrap.less'
    },
    modulesDirectories: ['node_modules', 'components']
  },

  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true })
  ]
};
