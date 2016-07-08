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
  options.entry = {
    app: [options.src || './src/index.js']
  } || options.entry;

  // Webpack config:
  var config = {
    watch: true,
    devtool: 'source-map',
    entry: options.entry,
    output: {
      path: options.dest,
      publicPath: '/build/',
      filename: 'bundle.js'
    },
    plugins: [
      new WebpackLivereload()
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: ['es2015']
          }
        }
      ]
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

    console.log(options);

    new WebpackServer(webpack(config(options))).listen(options.port, 'localhost', function (err) {
      console.error('no server started');
    });
  }
}
