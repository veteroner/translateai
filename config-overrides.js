const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Node polyfill eklentisini yapılandır
  config.plugins.push(
    new NodePolyfillPlugin({
      excludeAliases: ['console'],
      includeAliases: ['process', 'buffer']
    })
  );

  // Node: şeması ile başlayan modülleri yeniden yönlendir
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /^node:/, 
      (resource) => {
        // Node: şema adını kaldır
        const moduleName = resource.request.replace(/^node:/, '');
        
        // Modüle göre özel işlemler
        if (moduleName === 'fs' || moduleName === 'fs/promises') {
          resource.request = false;
        } else if (moduleName === 'https') {
          resource.request = false;
        } else {
          resource.request = moduleName;
        }
      }
    )
  );

  // Process modülünü manuel olarak enjekte et
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /process\/browser/,
      require.resolve('process/browser.js')
    )
  );

  // Tüm modüller için fallback yapılandırması
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    'fs/promises': false,
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
    buffer: require.resolve('buffer/'),
    process: require.resolve('process/browser.js'),
    https: false,
    http: false,
    crypto: require.resolve('crypto-browserify'),
    zlib: require.resolve('browserify-zlib'),
    querystring: require.resolve('querystring-es3'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url/'),
    assert: require.resolve('assert/')
  };

  // Webpack global değişkenler ekleme
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: ['process/browser.js'],
      Buffer: ['buffer', 'Buffer']
    })
  );

  // Sorunlu modülleri noop ile değiştir
  const noopPath = path.resolve(__dirname, 'noop.js');
  config.resolve.alias = {
    ...config.resolve.alias,
    'node:fs/promises': noopPath,
    'node:fs': noopPath,
    'node:https': noopPath,
    // Diğer node: modülleri için aynısını yap
  };

  // ESM modüllerini işlemek için babel kullanma
  // Ancak çok büyük modülleri es5'e dönüştürme
  const babelRule = config.module.rules.find(rule => 
    rule.oneOf && Array.isArray(rule.oneOf));

  if (babelRule && babelRule.oneOf) {
    babelRule.oneOf.unshift({
      test: /\.m?js$/,
      include: [/node_modules\/pptxgenjs/, /node_modules\/canvg/, /node_modules\/axios/],
      exclude: [/node_modules\/pdfjs-dist/, /node_modules\/docx/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-modules-commonjs'],
          compact: true,
          sourceType: 'unambiguous'
        }
      }
    });
  }

  return config;
}; 