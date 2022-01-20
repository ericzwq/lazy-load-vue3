const path = require('path')

module.exports = {
  pages: {
    index: {
      entry: "examples/main.ts",
      template: "examples/index.html",
      filename: "index.html"
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('~', path.resolve('lib'))
  }
}
