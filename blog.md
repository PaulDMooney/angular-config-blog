# Configuring your Angular App with Environment Variables
In this post I'm going to talk about configuring your Angular application using environment variables. To some this might sound strange, how and why do you have environment variables in an app that's meant to run in the browser? That's what we'll answer.

## Environment Variables vs. Environment.ts file
Angular has Environment.ts files, when you first generate your app using a command like this:

```
npx @angular/cli new my-app
```
It will create an `Environment.ts` and an `Environment.prod.ts`. Many people might be tempted to use these as the place to store environment specific information, such as API server URLs or 3rd party keys. They'll create extra files such as `Environment.qa.ts`, `Environment.staging.ts`, `Environment.preprod.ts`, etc. for every single place their app is deployed. But doing this is violation of the [third factor](https://12factor.net/config) of [The Twelve-Factor App](https://12factor.net/). You want to be a good programmer and write Twelve-Factor apps don't you? DON'T YOU?! You do!

So let's think about those `Environment*.ts` files as being misnomers that should really be called `Mode*.ts` files, where we configure the app's mode (like debug mode for local development), instead of a place to store environment information. Most likely you'll probably only end up needing the two default `Environment*.ts` files that the CLI initially gave you. For all the environment specific configuration we'll use environment variables.

<!-- Talk about 12 factor app. limitations of building configuration into the app. Ideal number of Environment.ts files -->

## Server Side Rendering
A common useage for environment variables in your SPA can be for the URLs of your API server(s). Let's assume that when your app is rendered in the browser, it's been served through a web server such as [Ngninx](https://www.nginx.com/) or [Apache](https://httpd.apache.org/). Those web servers likely have reverse proxies configured to your API server(s) to avoid issues with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). Then configuring the API Server URLs is done in those web servers. Nothing to do in our app for this case, except to call the API server using relative URLs, leaving off specific host names.

If you have setup Angular Universal for server side rendering (for the sake of brevity, using this command `npm run ng -- add @nguniversal/express-engine --client-project=my-app` so our setups are aligned) then likely you'll find that you need absolute URLs to the API Server during server rendering time.

This can be fairly simple, we can take advantage of Angular's [platform check](https://angular.io/api/common/isPlatformServer) and Node.js' [process.env](https://nodejs.org/api/process.html#process_process_env) to access environment variables.
<!-- Need example here showing construction of API URL for Http usage. -->

<!-- Something about local development and proxy.conf.js ?? -->

## Client and Server Side Rendering
<!-- Setup a config server for the client. Don't attempt transfer state. Setup proxy server for local development -->

<!-- What about client only? Read config from cookies -->

## App Initialization
<!-- The app initialization module is a good place to read config. -->

## Before App Initialization
<!-- There are times App initialization doesn't happen soon enough.-->