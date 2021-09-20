import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentReportsComponent } from './recent-reports.component';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,
];
const components = [
  RecentReportsComponent
];
const routes: Routes = [
  {
    path: 'recent-reports',
    component: RecentReportsComponent
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

export class RecentReportsModule { }
