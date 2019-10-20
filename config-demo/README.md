# ConfigDemo

## Environment Variables

* API_SERVER => Host and port of the API server the app needs to talk to.
* APP_SERVER => Host and port of this app when it's running on SSR mode. Used by docker-compose. One of http://docker.for.mac.localhost:4000` on MacOS, `SPA_URL=http://docker.for.win.localhost:4000` on Windows, or `SPA_URL=http://172.17.0.1:4000` on Linux. 
* NGINX_API_SERVER => Host and port of the API server from nginx's point of view.
One of http://docker.for.mac.localhost:3000` on MacOS, `SPA_URL=http://docker.for.win.localhost:3000` on Windows, or `SPA_URL=http://172.17.0.1:3000` on Linux. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
