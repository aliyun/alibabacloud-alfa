
import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser'; 
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import singleSpaAngular from 'single-spa-angular';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic().bootstrapModule(AppModule);
  },
  template: '<app-root />',
  NgZone: NgZone,
  AnimationEngine: AnimationEngine,
});

// platformBrowserDynamic().bootstrapModule(AppModule);


export const bootstrap = [lifecycles.bootstrap];
export const mount = [lifecycles.mount];
export const unmount = [lifecycles.unmount];
export const update = [];