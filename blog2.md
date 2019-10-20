# Good Practices for Configuring your Angular App
In this post I'm going to talk about some of the best ways to get your configurations to your Angular app. Just note, this isn't a post about Angular framework level configurations, this about how the features you're developing receive your configurable values.

## Where's my Backend API Server?
Most SPAs need a backend API server, so when development starts there's the question of "how do I tell my app where my API server is?" The answer is that you don't. Your app should assume the API server is served from the same host as the app itself. It will only use relative URLs (in this case "relative" means no protocol, host, or port specified) to call the API server.

For example:
TODO: Need sample code of HttpClient call.

This is nice and clean, and avoids [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) complications and issues.

How do we achieve this? With [Reverse Proxies](https://www.nginx.com/resources/glossary/reverse-proxy-server/).

Let's look at the scenario where your backend API server sits at `http://myinternalhost:8080/api` and we want the app to be able to make requests only to paths starting with `/api`. Here's how you can configure reverse proxies for development and when deployed:

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

And alter the "start" npm script to tell it to use the `proxy.conf.js` file:

```json
"start":"ng serve --proxy-config proxy.conf.js"
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
In server side rendering (SSR), your Angular app's code is running on the server similar to how it would run in the browser, complete with the API calls it needs to make but with a few exceptions. One of those exceptions is that relative URLs are meaningless on the server, servers want absolute URLs. So it turns out that our app *does* need that absolute URL to the backend API server afterall.

Luckily, when rendering on the server, we're not in a context where we need to worry about CORS, and we are in a context where your code can read environment variables. So our example HttpClient request can be altered to look like this:

TODO: Updated example HttpClient call

This doesn't mean we can ditch the reverse proxy setup, we still need that when the app is running in the browser. This is just an extra consideration to make when leveraging SSR.

## Environment Variables vs Environment.ts
Let's imagine another scenario where your Angular app has a typeahead search in it, and it needs a debounce time to decide when the user has stopped typing and it's safe to make an API call. Kind of like [this article](https://www.freakyjolly.com/angular-7-6-add-debounce-time-using-rxjs-6-x-x-to-optimize-search-input-for-api-results-from-server/) describes. We want to make the debounce time configurable.

It'd be tempting to use the `Environment.ts` and `Environment.prod.ts` as the configuration point for this debounce time, but you probably shouldn't. Just don't. It's a violation of the [third factor](https://12factor.net/config) of [The Twelve-Factor App](https://12factor.net/). The short of it is that if you are using a version controlled file in your app to store configuration then your app has to be rebuilt and redeployed just to affect a configuration change. Sounds like hardcoding not configuration. This is fine for the world of Infrastructure as Code and Gitops but it is not ideal for applications.

In general you probably won't use the `Environment.ts` files much unless there are different modes your application needs to be built in. If you find yourself writing `Environment.staging.ts` or `Environment.qa.ts` files, you're doing it wrong.

So how do you configure this 'debounce' time in the app? With Environment Variables! How do we use environment variables in an app that runs in the browser? Serve them via bankend API.

There's multiple ways to do this. We'll take the approach that we're using a purpose built "Config" REST endpoint just for this Angular app.

### Sending environment variables during Development
A quick and easy way to create a Config REST endpoint to use during development is to leverage the webpack's proxy server. We can create a faux backend inside the `proxy.conf.js` file like so:

```javascript
const PROXY_CONFIG = {
    '/config': {
        'bypass': function (req, res, proxyOptions) {
            switch (req.url) {
                case '/config':

                // Send an map of config values
                res.end(JSON.stringify({
                    DEBOUNCE_TIME: process.env.DEBOUNCE_TIME || 500 // Read from environment or default to 500
                    ... // Other config values here
                }));
                return true;
            }
        }
    }
    ... // Other proxy settings
};

export PROXY_CONFIG;
```

From there it's just a matter of making a call to this `/config` endpoint just like any other endpoint.

TODO: Sample code to grab config values

You can start your development server with an environment variable like so `DEBOUNCE_TIME=300 npm start`

### Sending environment variables when Deployed
If you're leveraging server side rendering, you'll probably have a `server.ts` file (likely generated by a [schematic](https://angular.io/guide/schematics) like [@nguniversal/express-engine](https://www.npmjs.com/package/@nguniversal/express-engine)). This is a good place to add a little extra functionality to serve up configuration from server read environment variables in a similar manner to how it's done in the `proxy.conf.js` example.

Add the following to the `server.ts` file used for SSR:

```javascript
app.get('/configapi', (req, res) => {
  res.status(200).send({
    DEBOUNCE_TIME: process.env.DEBOUNCE_TIME || 500 // Read from environment or default to 500
    ... // Other config values here
  });
});
```

If you're using server side rendering, when the code is executing on the server you won't necessarily need to call this API (though you could) since you can just directly access the environment variables from within code. However, to keep things simple, it's probably best to hide how all of your configuration values are retreived behind a single "Config" Angular service.

TODO: Example config service

#### Avoid Depending on Transferstate to Transport your Configuration
When using server side rendering, It may be tempting to avoid setting up a "Config" REST service like the one above and just leverage transfer state to gather values from environment variables on the server and send them to the client. This may or may not work for you but if you're enabling [Progressive Web App](https://angular.io/guide/service-worker-getting-started) then a good deal of the time server side rendering won't even come into play since the app is rendered from javascript and other assets cached in the browser, bypassing SSR. Since there's no SSR happening in a PWA, there's no transferstate, so it's not a good idea to make it the sole medium for transporting configuration values.

## The right time to call your Configuration API endpoint

### On Demand, maybe leveraging a behaviour subject
TODO
### From the Angular APP_INITIALIZER hook
TODO
### Before Angular Starts
-- In the main.ts file 
TODO

## .env files
One last bonus tidbit of information: It can be tedious to setup environment variables in the command line when developing. Especially if there's a lot of them. The answer to this problem is the `.env` file.

It's a simple file where each line is an environment variable assignment in the format `VARIABLE_NAME=value`.

The `.env` file works out of the box in some environments, like for docker-compose, but doesn't work out of the box in node.js. You'll need to install the library [dotenv](https://www.npmjs.com/package/dotenv) as a dev dependency: `npm i -D dotenv` and then have it loaded up.

To load it in your `proxy.conf.js`, just add the following line to the top of the file.
```javascript
require('dotenv').config();
```

To load it for SSR, alter the npm script called "serve:ssr" to the following:
```json
"serve:ssr":"node -r dotenv/config dist/server"
```

Finally be sure `.env` file entry is added to your `.gitignore` file. This file is for your local development, it would be really annoying if your settings were regularly and unexpectedly clobbered by someone else's changes whenever you're pulling the latest.
