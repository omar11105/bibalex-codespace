module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress Monaco Editor source map warnings
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /ENOENT: no such file or directory/,
        /monaco-editor/
      ];
      
      return webpackConfig;
    },
  },
}; 