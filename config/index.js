// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
console.log('__dirname',__dirname)
console.log(path.resolve(__dirname, '../release/main.html'))
console.log(path.resolve(__dirname, '../release'))

module.exports = {
    build: {
        env: {
            NODE_ENV: '"production"'
        },
        index: path.resolve(__dirname, '../release/main.html'),
        assetsRoot: path.resolve(__dirname, '../release'),//
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        bundleAnalyzerReport:false,
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: true,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: {
            NODE_ENV: '"development"'
        },
        port: 8000,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        context: [ //代理路径
            '/mock',
        ],
        proxypath: 'https://find.cmpay.com:9102/',
        // proxypath: 'http://211.138.236.219:9103/',
        // proxypath: 'http://113.108.79.80:3020/',
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
        host: '192.168.31.24'
    }
}
