"use strict";

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    bundle: __dirname + '/app/app.js',
    // vendor: ['angular', 'angular-router']
  },
  output: {
    filename: "[name]-[hash:7].js",
    path: __dirname + '/dist'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            options: {
              singleton: true // 处理为单个style标签
            }
          },
          {
            loader: 'css-loader',
            options: {
              minimize: {
                safe: true
              }
            }
          },
          'sass-loader',
        ],
        // include: [
        //   path.resolve(__dirname) + '/app/styles', 
        //   path.resolve(__dirname) + 'app/bower_components', 
        //   path.resolve(__dirname) + '/node_modules'
        // ] 
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true
        }
      }
    ]
  },
  // resolve:{
  //     extensions:['.js','.css','.json'] //用于配置程序可以自行补全哪些文件后缀
  // },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({})
    ],
    //包清单
    // runtimeChunk: {
    //   name: "manifest"
    // },
    //拆分公共包
    splitChunks: {
      cacheGroups: {
        //项目公共组件
        common: {
          chunks: "initial",
           name: "common",
           filename: 'common.js',
           minChunks: 2,
           maxInitialRequests: 5,
           minSize: 0
        },
        //第三方组件
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          filename: 'vendor.js',
          priority: 10,
          enforce: true
        }
      }
    }
  },
  plugins:[
    new CleanWebpackPlugin(['dist']), //传入数组,指定要删除的目录
    new CopyWebpackPlugin([
      {from: __dirname + '/app/img/favicon.ico', to: __dirname + '/dist/img/favicon.ico'}
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? 'style.css' : 'style-[hash:7].css',
      chunkFilename: devMode ? '[id].css' : '[id]-[hash:7].css',
    }),
    new HtmlWebpackPlugin({
      title: 'hello webpack',
      template: __dirname + '/app/index.html',
      inject: 'body',
      minify:{ //压缩HTML文件
         removeComments:true,  //移除HTML中的注释
         collapseWhitespace:true  //删除空白符与换行符
       }
    })
  ],
  devServer: {
    contentBase: 'app'
  }
};