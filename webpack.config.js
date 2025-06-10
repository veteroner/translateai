const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProduction 
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/bundle.js',
      publicPath: '/'
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    module: {
      rules: [
        // JavaScript/JSX işleme
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        },
        // CSS dosyaları
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },
        // Resim ve diğer dosyalar
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024 // 10kb
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      fallback: {
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        path: require.resolve('path-browserify'),
        process: require.resolve('process/browser.js'),
        url: require.resolve('url/'),
        fs: false,
        http: false,
        https: false,
        os: require.resolve('os-browserify/browser'),
        zlib: require.resolve('browserify-zlib'),
        querystring: require.resolve('querystring-es3'),
        assert: require.resolve('assert/')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico',
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true
        } : false
      }),
      // Node modüllerini tarayıcı ortamına uyarlama
      new webpack.ProvidePlugin({
        process: ['process/browser.js'],
        Buffer: ['buffer', 'Buffer']
      }),
      // Node URL şemasını düzeltme
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        // Node: şema adını kaldır
        resource.request = resource.request.replace(/^node:/, '');
      }),
      // CSS ekstraktörü (production)
      ...(isProduction ? [new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css'
      })] : []),
      // Environment değişkenlerini enjekte et
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      })
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              comparisons: false
            },
            output: {
              comments: false,
              ascii_only: true
            }
          }
        }),
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        name: false
      }
    },
    performance: {
      hints: isProduction ? 'warning' : false
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      historyApiFallback: true,
      hot: true,
      port: 3000,
      open: true
    }
  };
}; 