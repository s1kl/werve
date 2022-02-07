const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  cache: {
    type: 'filesystem'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html'// ,
      // favicon: './src/images/favicon.ico'
    // }),
    // new CopyPlugin({
    //   patterns: [
    //     { from: './src/images/favicon.svg', to: 'favicon.svg' }
    //   ]
    })
  ],
  // devtool: 'source-map',
  // mode: 'development',
  mode: 'production',
  optimization: {
    minimize: false
  },
  // mode: 'none',
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { url: false }
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './dist')
    },
    host: '0.0.0.0'
  },
  performance: {
    hints: false
  // },
  // performance: {
  //   maxEntrypointSize: 1000000,
  //   maxAssetSize: 1000000
  } // これがあるとyarn build出来ない
}
