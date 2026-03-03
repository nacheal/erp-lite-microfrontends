module.exports = {
  port: 4000,
  host: '0.0.0.0',
  cors: true,
  watch: true,
  middlewares: [
    require('./middleware.js')
  ]
};
