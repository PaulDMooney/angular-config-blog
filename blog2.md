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
When you're deploying your application, you won't have webpack's dev-server to use as a reverse proxy so you'll need a separate standalone one. Popular options for reverse proxies are webservers like [NGINX](https://www.nginx.com/) or [Apache HTTP Server](https://httpd.apache.org/). These serve other purposes as well such as handling HTTPS, load balancing, or if you're not using Server Side Rendering (https://angular.io/guide/universal) they can be used to host your Angular app's static assets. So it's likely you'll need one of these anyways.

The key idea here is that the reverse proxy is the single point for traffic to and from the browser for both requests to your app, and requests to the API server.

TODO: Possible image here?

Here's a snippet of nginx configuration that forwards traffic to your app, and to our `http://myinternalhost:8080` API server:

TODO: Example configuration

### What about Server Side Rendering?
In server side rendering, your code is running on the server similar to how it would run in the browser, complete with the API calls it needs to make but with a few exceptions. One of those exceptions is that relative URLs are meaningless on the server, so it turns out that our app does need the absolute URL for our backend API server afterall.

Luckily, when rendering on the server, we're not in a context where we need to worry about CORS, and we are in a context where your code can read environment variables. So our example HttpClient request can be altered to look like this:

TODO: Updated example HttpClient call

### Another exception to the rule...
TODO: Was going to do this thing on HTTPInterceptor for transferstate... but it's a really convoluted case that can be solved in other ways.

## Environment Variables vs Environment.ts

### Sending environment variables during Development

### Sending environment variables when Deployed

## The right time to call your Configuration API endpoint

## .env files
