var path = require('path')

module.exports = {
    mode: 'development',
    entry: './docs/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'docs')
    },
    module: {}
};
