var path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: './dist/',
    filename: 'vue-simple-emoji.js',
    library: 'VueSimpleEmoji',
    libraryTarget: 'umd'
  }
}
