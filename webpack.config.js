const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'prod';
const TEST = process.env.NODE_ENV === 'test';
const CG_STYLE_PATH = process.env.CG_STYLE_PATH;

const SKIN_NAME = process.env.SKIN_NAME || 'cg';

// getSkinEnv looks in the skin module for an `env.js` file which is expected to
// contain an array of additional environment variable names that should be
// added to the webpack DefinePlugin.
// If the skin's env module is not found, an empty array is returned: this
// makes the feature opt-in for skins.
const getSkinEnv = () => {
  const mod = path.resolve(
    __dirname,
    `static_src/skins/${SKIN_NAME}/env`
  );

  try {
    require.resolve(mod);
  } catch (e) {
    return [];
  }

  return require(mod); // eslint-disable-line import/no-dynamic-require, global-require
};

const srcDir = './static_src';
const compiledDir = './static/assets';

const config = {
  bail: false,

  entry: ['babel-polyfill', `${srcDir}/main.js`],

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
      {
        test: /\.(ttf|woff2?|eot)$/,
        loader: 'url-loader?limit=1024&name=font/[name].[ext]'
      }
    ]
  },

  resolve: {
    alias: {
      'cloudgov-style': 'cloudgov-style',
      dashboard: path.resolve(__dirname, 'static_src'),
      skin: path.resolve(__dirname, `static_src/skins/${SKIN_NAME}`)
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

const processEnv = {
  SKIN_NAME: JSON.stringify(SKIN_NAME)
};

if (PRODUCTION) {
  processEnv.NODE_ENV = JSON.stringify('production');
}

const skinEnv = getSkinEnv();

skinEnv.forEach((env) => {
  processEnv[env] = JSON.stringify(process.env[env]);
});

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': processEnv
  })
);

module.exports = config;
