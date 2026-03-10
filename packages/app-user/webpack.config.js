const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const packageName = 'app-user';
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  // 恢复双入口：独立运行和微前端分开
  entry: {
    main: './src/main.tsx',      // 独立运行入口
    index: './src/index.tsx',    // 微前端入口
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    publicPath: isDev ? 'http://localhost:3001/' : '/app-user/',
    clean: true,
    // 为不同入口配置不同的库名称
    library: (name: string) => {
      if (name === 'index') {
        return 'app-user';  // 微前端入口使用 qiankun 期望的名称
      }
      return `app-user-${name}`;  // 其他入口使用带前缀的名称
    },
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    globalObject: 'window',
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
                localIdentName: isDev ? 'usr-[name]__[local]--[hash:base64:5]' : 'usr-[name]__[hash:base64:5]',
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
        },
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
      // 使用绝对路径避免找不到模板
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      // 关键：显式指定注入 index 这个 chunk
      chunks: ['index'],
      inject: 'body',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),
  ],

  devServer: {
    port: 3001,
    hot: true,
    open: false,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // 确保开发服务器能正确处理静态资源
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },

  devtool: isDev ? 'eval-source-map' : 'source-map',
};
