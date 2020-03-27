const path = require('path');
const { config: dotenvConfig } = require('dotenv');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
dotenvConfig({ path: './.env' });

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
  plugins: [
    new webpack.EnvironmentPlugin(['DISCORD_BOT_TOKEN', 'YOUTUBE_API_KEY'])
  ],
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
