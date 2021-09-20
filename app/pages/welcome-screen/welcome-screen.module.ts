import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeScreenComponent } from './welcome-screen.component';
import { Routes, RouterModule } from '@angular/router';
import { ButtonModule, CarouselModule } from 'primeng';

const imports = [
  CommonModule,
  ButtonModule,
  CarouselModule
];
const components = [
  WelcomeScreenComponent
];
const routes: Routes = [
  {
    path: 'welcome',
    component: WelcomeScreenComponent
  }
];
@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class WelcomeScreenModule { }