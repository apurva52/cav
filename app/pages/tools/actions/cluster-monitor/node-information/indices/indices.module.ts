import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesComponent } from './indices.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, TableModule, TooltipModule } from 'primeng';

const routes: Routes = [
  {
    path: 'indices',
    component: IndicesComponent,
  },
];

const imports = [CommonModule, ChartModule, TooltipModule, TableModule, ButtonModule];

const components = [IndicesComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class IndicesModule { }
