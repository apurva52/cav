import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailedComponent } from './detailed.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng';


const imports = [
  CommonModule,
  CardModule
];
const components = [
  DetailedComponent
];
const routes: Routes = [
  {
    path: 'detailed',
    component: DetailedComponent
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

export class DetailedModule { }
