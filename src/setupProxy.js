
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Add proxy rule for /profile to avoid CORS issues
  app.use(
    '/profile',
    createProxyMiddleware({
      target: 'https://localhost:443',
      secure: false,
      changeOrigin: true,
    })
  );
};