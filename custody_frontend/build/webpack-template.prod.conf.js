'use strict'
const merge = require('webpack-merge')
const config = require('../config')
const path = require('path')
const productionWebpackConfig = require('./webpack.prod.conf')
const templateName = process.env.TEMPLATE_NAME

const webpackConfig = merge(productionWebpackConfig, {
  entry: {
    app: './src/template.js'
  },
  output: {
    path: path.resolve(config.build.assetsRoot, templateName)
  }
})

module.exports = webpackConfig
