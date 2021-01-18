'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'
process.env.TEMPLATE_NAME = process.argv.slice(2)[0]
const ora = require('ora')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackConfig = require('./webpack.prod.conf')
const webpackTemplateConfig = require('./webpack-template.prod.conf')
const rm = require('rimraf')
const path = require('path')
const config = require('../config')

const spinner = ora('building for production...')
spinner.start()
const templateName = process.env.TEMPLATE_NAME
const isTemplate = templateName !== 'undefined'
const rmPath = isTemplate ? path.join(config.build.assetsRoot, templateName) : config.build.assetsRoot

rm(rmPath, err => {
  if (err) throw err

  webpack( isTemplate ? webpackTemplateConfig : webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ))
  })

})

