const path = require('path');
const Dotenv = require('dotenv-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    bot: './src/bot.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.ts', '.js', '.json']
  },
  target: 'node',
  devtool: 'source-map',
  stats: {
    all: true,
    // children: false,
    // errors: true,
    // errorDetails: true,
    // colors: true,
    // builtAt: true
  },
  watchOptions: {
    ignored: ['public/**', 'node_modules/**'],
    aggregateTimeout: 300
  },
  plugins: [new Dotenv()],
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader'
      }
    ]
  }
};
