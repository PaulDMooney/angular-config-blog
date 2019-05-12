const PROXY_CONFIG = {
  'api': {
    'target': process.env.API_SERVER,
    'secure': false,
    'logLevel': 'debug',
    'changeOrigin': true
  }
};
