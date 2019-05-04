## Generate project
npx @angular/cli new my-app
<answer questions>
cd my-app
npm run ng -- add @nguniversal/express-engine --client-project=my-app

// Old way. Doesn't produce server.ts file.
npm run ng -- generate universal --client-project=my-app


## Add PWA
npm run ng -- add @angular/pwa

## Add Jest ??