'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/djjf-web': {
        target: 'http://172.25.49.143:8080',//后端测试地址
        // target: 'http://172.25.49.143:8080',//后端测试地址
        // target: 'http://localhost:8080',//后端测试地址
        //target: 'http://10.13.220.249:8080', //顾伟电脑地址
        //target:'http://1.199.231.175:61000',//艾克地址
       // target: 'http://10.13.244.155:8080', //天龙电脑地址
        //target:"http://192.168.1.174:8080",//鹏飞地址
        changeOrigin: true,     //跨域
      },
      '/assetAllocation': {
        target: 'http://10.222.9.54:8001',//后端测试地址
        changeOrigin: true,     //跨域
      },
      '/strategyOrder': {
        target: 'http://10.222.9.54:8001',//后端测试地址
        changeOrigin: true,     //跨域
      },
      '/activity': {
        target: 'http://10.222.9.54:8001',//后端测试地址
        changeOrigin: true,     //跨域
      },
      '/share': {
        target: 'http://10.222.9.54:8001',//后端测试地址
        changeOrigin: true,     //跨域
      },
      '/cmsCfg': {
        target: 'http://10.222.9.54:8001',//后端测试地址
        changeOrigin: true,     //跨域
      },
      '/weChat':{
        target: 'http://10.222.9.53:8002',//后端测试地址
        //target: 'http://10.13.248.114:8083',//庭艳测试地址
      },
      '/gw/':{
        target: 'http://ms.jr.jd.com',//后端测试地址
        //target: 'http://10.13.248.114:8083',//庭艳测试地址
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
