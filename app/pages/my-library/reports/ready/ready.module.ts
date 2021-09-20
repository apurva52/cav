import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadyComponent } from './ready.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng';

const imports = [
  CommonModule,
  CardModule
];
const components = [
  ReadyComponent
];
const routes: Routes = [
  {
    path: 'ready',
    component: ReadyComponent
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
export class ReadyModule { }
