/**
 * Created by 32237384@qq.com on 2018/7/30.
 */
const webpackConfig = require('./webpack.base.conf')
const vuxLoader = require('vux-loader')

module.exports = vuxLoader.merge(webpackConfig, {
  options: {},
  plugins: [{
    name: 'vux-ui'
  }]
})
