import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application } from './index.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    Application
  ],
  exports: [
    Application // <-- this!
  ]
})
export class ApplicationModule { }