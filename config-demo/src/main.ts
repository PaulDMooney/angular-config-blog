import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', async () => {

  const response = await fetch('/config');
  if (response.status === 200) {
    const result = await response.text();
    localStorage.setItem('config', result);
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  }
});
