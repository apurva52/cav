import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyProfileComponent } from './my-profile.component';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  
];

const components = [
  MyProfileComponent
];

const routes: Routes = [
  {
    path: 'my-profile',
    component: MyProfileComponent
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
export class MyProfileModule { }
