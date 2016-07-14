// Modules:
var path              = require('path');
var webpack           = require('webpack');
var webpackStream     = require('webpack-stream');
var WebpackServer     = require('webpack-dev-server');
var WebpackLivereload = require('webpack-livereload-plugin');


module.exports = {
  config: config,
  server: server,
  webpack: function (options) {
    return webpackStream(config(options));
  }
};


// Webpack Config:
function config (options) {

  // Default options:
  var options = options || {};
  options.entry = options.entry || {
    app: [options.src || './src/index.js']
  };
  var loaders = [
    {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        cacheDirectory: true,
        presets: ['es2015']
      }
    }
  ].concat(options.loaders || []);

  // Webpack config:
  var config = {
    watch: true,
    devtool: 'source-map',
    entry: options.entry,
    output: {
      path: options.dest,
      publicPath: '/build/',
      filename: '[name]-bundle.js'
    },
    plugins: [
      new WebpackLivereload()
    ],
    module: {
      loaders: loaders
    }
  };

  return config;
};


// Dev server:
function server (options) {
  return function () {

    // Default options:
    options = options || {};
    options.port = options.port || 8080;

    new WebpackServer(webpack(config(options))).listen(options.port, 'localhost', function (err) {
      if (err) {
        console.error('no server started');
      } else {
        console.log('server started on ' + options.port);
      }
    });
  }
}

