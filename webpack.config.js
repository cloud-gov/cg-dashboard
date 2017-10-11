const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = (process.env.NODE_ENV === 'prod');
const TEST = (process.env.NODE_ENV === 'test');
const CG_STYLE_PATH = process.env.CG_STYLE_PATH;
const CF_SKIN = process.env.CF_SKIN || 'cg';

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
        exclude: /node_modules/
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
    alias: {
      'cloudgov-style': 'cloudgov-style',
      dashboard: path.resolve(__dirname, 'static_src'),
      skin: path.resolve(__dirname, `static_src/skins/${CF_SKIN}`)
    },

    modules: ['node_modules'],
    // Required for some module configs which use these fields
    // See https://github.com/flatiron/director/issues/349
    mainFields: ['browserify', 'browser', 'module', 'main'],

    symlinks: false
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

if (PRODUCTION) {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }));
}

module.exports = config;
