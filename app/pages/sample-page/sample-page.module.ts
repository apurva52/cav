import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SamplePageComponent } from './sample-page.component';
import { Routes, RouterModule } from '@angular/router';

const imports = [
  CommonModule
];
const components = [
  SamplePageComponent
];
const routes: Routes = [
  {
    path: 'sample-page',
    component: SamplePageComponent
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

export class SamplePageModule { }
