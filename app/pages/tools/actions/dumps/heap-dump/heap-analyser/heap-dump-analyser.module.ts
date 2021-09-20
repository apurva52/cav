import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeapDumpAnalyserComponent } from './heap-dump-analyser.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TabViewModule, BreadcrumbModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
const imports = [
  CommonModule,
  BreadcrumbModule,
  FormsModule,
  ReactiveFormsModule,
  TabViewModule,
  HeaderModule,
  ToolbarModule
];
const components = [
  HeapDumpAnalyserComponent
];
const routes: Routes = [
  {
    path: 'heap-analyser-dump',
    component: HeapDumpAnalyserComponent,

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
  ],
})
export class HeapDumpAnalyserModule { }





