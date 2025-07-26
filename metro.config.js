const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Completely disable file watching to avoid C++ exceptions on Windows
config.watchFolders = [];
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Use polling instead of file watching
config.watchman = false;

// Optimize for Windows
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Disable file watching completely
config.server = {
  ...config.server,
  watchOptions: {
    poll: 1000,
    ignored: ['**/node_modules/**', '**/.git/**'],
  },
};

module.exports = config; 