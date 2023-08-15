const path = require('path')

const [, entryName] = process.env.npm_lifecycle_event.split(':')
if (!entryName) throw 'Unknown command:' + process.env.npm_lifecycle_event

module.exports = {
  pages: {
    index: {
      entry: "test/" + entryName + "/main.ts",
      template: "test/index.html",
      filename: "index.html"
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('~', path.resolve('lib'))
  }
}
