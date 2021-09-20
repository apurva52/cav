import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { Routes, RouterModule } from '@angular/router';


const imports = [
  CommonModule
];

const components = [
  LoadingComponent
];

const routes: Routes = [
  {
    path: 'loading',
    component: LoadingComponent
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
export class LoadingModule { }

