const PROXY_CONFIG = {
  '/config': {
    'bypass': function (req, res, proxyOptions) {
        switch (req.url) {
            case '/config':

            // Send an map of config values
            res.end(JSON.stringify({
                DEBOUNCE_TIME: process.env.DEBOUNCE_TIME || 500 // Read from environment or default to 500
            }));
            return true
        }
    }
  },
  'api': {
    'target': process.env.API_SERVER,
    'secure': false,
    'logLevel': 'debug',
    'changeOrigin': true
  }
};

module.exports = PROXY_CONFIG;
