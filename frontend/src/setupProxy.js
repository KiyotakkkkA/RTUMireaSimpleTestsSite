const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const target = (process.env.REACT_APP_OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');

  app.use(
    '/ollama',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/ollama': '',
      },
      logLevel: 'warn',
    })
  );
};
