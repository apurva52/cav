import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegionComponent } from './region.component';
import { MessagesModule,AutoCompleteModule, ButtonModule, CardModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { ComparePerformanceModule } from '../page/compare-performance/compare-performance.module';
import { PerformanceDetailsModule } from '../page/performance-details/performance-details.module';
import { ResourcePerformanceModule } from '../page/resource-performance/resource-performance.module';
import { DomainPerformanceModule } from '../page/domain-performance/domain-performance.module';
import { PagePerformanceFilterModule } from '../page/page-performance-filter/page-performance-filter.module';

const imports = [
   MessagesModule,
  CommonModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  CardModule,
  FormsModule,
  DropdownModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
  AutoCompleteModule,
  ChartModule,
  ComparePerformanceModule,
  PerformanceDetailsModule,
  ResourcePerformanceModule,
  DomainPerformanceModule,
  PagePerformanceFilterModule
];
const components = [RegionComponent];
const routes: Routes = [
  {
    path: 'region',
    component: RegionComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionModule { }
