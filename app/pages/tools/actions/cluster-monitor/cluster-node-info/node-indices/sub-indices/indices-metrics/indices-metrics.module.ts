import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesMetricsComponent } from './indices-metrics.component';
import { RouterModule, Routes } from '@angular/router';
import {
  BreadcrumbModule,
  PanelModule,
  TooltipModule,
  TableModule,
} from 'primeng';

const routes: Routes = [
  {
    path: 'indices-metrics',
    component: IndicesMetricsComponent,
  },
];

const imports = [
  CommonModule,
  BreadcrumbModule,
  PanelModule,
  TooltipModule,
  TableModule,
];

const components = [IndicesMetricsComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class IndicesMetricsModule {}
