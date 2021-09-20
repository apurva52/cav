import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';
import { Routes, RouterModule } from '@angular/router';

const imports = [
  CommonModule
];

const components = [
  LogoutComponent
];

const routes: Routes = [
  {
    path: 'logout',
    component: LogoutComponent
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
export class LogoutModule { }
