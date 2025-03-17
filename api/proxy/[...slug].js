const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (req, res) => {
  createProxyMiddleware({
    target: 'https://controle-bc.bubbleapps.io',
    changeOrigin: true,
    pathRewrite: { '^/api/proxy': '' },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Host', 'controle-bc.bubbleapps.io');
    },
  })(req, res);
};
