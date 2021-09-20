import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemleakAnalyzerComponent } from './memleak-analyzer.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'memleak-analyzer',
    component: MemleakAnalyzerComponent,
  },
];

const imports = [CommonModule];

const components = [MemleakAnalyzerComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class MemleakAnalyzerModule {}
