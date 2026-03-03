module.exports = {
  port: 4000,
  host: '0.0.0.0',
  cors: true,
  watch: true,
  routes: {
    '/api/*': '/$1',
    '/micro-apps/config': '/$2'
  }
};
