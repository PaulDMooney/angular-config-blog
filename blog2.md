# Good Practices for Configuring your Angular App
In this post I'm going to talk about some of the best ways to get your configurations to your Angular app. Just note, this isn't a post about Angular framework level configurations, this about how the features you're developing receive your configurable values.

## Where's my Backend API Server?
Most SPAs need a backend API server, so when development starts there's the question of "how do I tell my app where my API server is?" The answer is that you don't. Your app should assume the API server is served from the same host as the app itself. It will only use relative URLs (in this case "relative" means no protocol, host, or port specified) to call the API server.

For example:
TODO: Need sample code of HttpClient call.

This is nice and clean, and avoids [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) complications and issues. 

How do we achieve this? With [Reverse Proxies](https://www.nginx.com/resources/glossary/reverse-proxy-server/)

Let's look at the scenario where your backend API server sits at `http://myinternalhost:8080/api` and we the app to be able to make requests only to `/api`, here's how you can configure reverse proxies for development and when deployed:

### Proxy Server during Development
When a project is generated using Angular CLI it uses [webpack](https://webpack.js.org/) (at least at the time of writing this) which includes a [dev server](https://webpack.js.org/configuration/dev-server/) that hosts the app and watches for changes when we run `ng serve` (or `npm start` if you're using the Angular CLI defaults). This server also includes a reverse proxy which can be configured via proxy.conf.js or proxy.conf.json file. You can read more about it in the [Angular CLI repo](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md). I prefer the 'js' version of the file since it gives us more flexibility.

Given our example scenario for getting requests from the relative path `/api` to the absolute path `http://myinternalhost:8080/api`, we can setup our proxy.conf.js in the root of out project folder like so:

```javascript
const PROXY_CONFIG = {
  '/api': {
    'target': 'http://myinternalhost:8080',
    'secure': false,
    'logLevel': 'debug',
    'changeOrigin': true
  }
};

module.exports = PROXY_CONFIG;
```

Of course it would be better if the `target` value was not hardcoded to a specific server in a file that we're going to be checking into version control, so we can use an environment variable instead. Let's make the above snippet better:

```javascript
const PROXY_CONFIG = {
  '/api': {
    'target': process.env.API_SERVER,
    'secure': false,
    'logLevel': 'debug',
    'changeOrigin': true
  }
};

module.exports = PROXY_CONFIG;
```

The environment variable can be passed via commandline `API_SERVER=http://myinternalhost:8080 npm start`

### Reverse Proxy when Deployed
---Docker container with nginx config

### What about Server Side Rendering?

### Another exception to the rule...

## Environment Variables vs Environment.ts

### Sending environment variables during Development

### Sending environment variables when Deployed

## The right time to call your Configuration API endpoint

## .env files
