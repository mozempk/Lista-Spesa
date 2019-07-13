var path = require('path')
var config = require('../config')
var MiniCSSExtractPlugin = require('mini-css-extract-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders, loaderOptions) {
    var styleLoader = []
    // If typeof "loaders" is object and also is an array
    if (typeof loaders === 'object' && Array.isArray(loaders)) {
      loaders.forEach(function(element) {
        if (typeof element === 'object' && !Array.isArray(element)) {
          styleLoader.push({
            loader: element.loader,
            options: Object.assign({}, element.options) || {}
          })
        } else if (typeof element === 'string') {
          styleLoader.push(element)
        }
      });
    // If typeof "loaders" is object and is not an array 
    } else if (typeof loaders === 'object' && !Array.isArray(loaders)) {
      styleLoader.push({
        loader: loaders.loader,
        options: Object.assign({}, loaders.options) || {}
      })
    // If typeof "loaders" is string
    } else if (typeof loaders === 'string') {
      styleLoader.push(loaders)
    }
    return styleLoader
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html

   return {
    css: generateLoaders([(process.env.NODE_ENV !== 'production' ? 'vue-style-loader' : MiniCSSExtractPlugin.loader), 'css-loader']),
    postcss: generateLoaders(['vue-style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }, 'postcss-loader']),
    less: generateLoaders(['vue-style-loader', 'css-loader', 'less-loader']),
    sass: generateLoaders(['vue-style-loader','css-loader', { loader: 'sass-loader', options: { indentedSyntax: true } }]),
    scss: generateLoaders(['vue-style-loader','css-loader', { loader: 'sass-loader', options: { indentedSyntax: true } }]),
    stylus: generateLoaders(['vue-style-loader', 'css-loader', 'stylus-loader']),
    styl: generateLoaders(['vue-style-loader', 'css-loader', 'stylus-loader'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
