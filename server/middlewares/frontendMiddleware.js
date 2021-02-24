/* eslint-disable global-require */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    const addProdMiddlewares = require('./addProdMiddlewares');
    addProdMiddlewares(app, options);
  } else {
    app.use('/api',
      createProxyMiddleware({
        target: 'http://localhost:3001',
        secure: true
      }));
    const webpackConfig = require('../../webpack/webpack.dev.babel');
    const addDevMiddlewares = require('./addDevMiddlewares');
    addDevMiddlewares(app, webpackConfig);
  }

  return app;
};
