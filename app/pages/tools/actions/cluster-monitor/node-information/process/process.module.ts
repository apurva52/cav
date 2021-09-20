import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, TableModule, TooltipModule } from 'primeng';

const routes: Routes = [
  {
    path: 'process',
    component: ProcessComponent,
  },
];

const imports = [CommonModule, ChartModule, TooltipModule, TableModule, ButtonModule];

const components = [ProcessComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class ProcessModule { }
