const path = require('path');

const cssConfig = {
  query: {
    modules: true,
    localIdentName: '[local]-[hash:base64:10]',
    camelCase: true
  }
}

module.exports = {
  type: 'react-app',
  webpack: {
    extra: {
      resolve: {
        root: [path.resolve('./src')],
        extensions: ['', '.js', '.scss']
      }
    },
    loaders: {
      'css': cssConfig,
      'sass-css': cssConfig
    }
  },
  babel: {
    stage: 0
  }
}
