import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewMemleakAnalysisComponent } from './new-memleak-analysis.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'memleak-analysis',
    component: NewMemleakAnalysisComponent,
  },
];

const imports = [CommonModule];

const components = [NewMemleakAnalysisComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class NewMemleakAnalysisModule {}
