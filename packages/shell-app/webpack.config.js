const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './src/main.tsx',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    publicPath: 'auto',
    clean: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(tsx|ts|jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDev ? '[name]__[local]--[hash:base64:5]' : '[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDev ? '[name]__[local]--[hash:base64:5]' : '[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash:8][ext]',
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
    new webpack.DefinePlugin({
      'import.meta.env.VITE_APP_USER_ENTRY': JSON.stringify(process.env.VITE_APP_USER_ENTRY),
      'import.meta.env.VITE_APP_PRODUCT_ENTRY': JSON.stringify(process.env.VITE_APP_PRODUCT_ENTRY),
      'import.meta.env.VITE_APP_ORDER_ENTRY': JSON.stringify(process.env.VITE_APP_ORDER_ENTRY),
      'import.meta.env.VITE_APP_DASHBOARD_ENTRY': JSON.stringify(process.env.VITE_APP_DASHBOARD_ENTRY),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
    }),
  ],

  devServer: {
    port: 3000,
    hot: true,
    open: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  devtool: isDev ? 'eval-source-map' : 'source-map',
};
