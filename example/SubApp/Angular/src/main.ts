
import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser'; 
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { bootstrap } from '@alicloud/console-os-ng-portal';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';


if (environment.production) {
  enableProdMode();
}

export default bootstrap({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic().bootstrapModule(AppModule);
  },
  template: '<app-root />',
  NgZone: NgZone,
  AnimationEngine: AnimationEngine,
});

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/