import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceDetailsCompareComponent } from './performance-details-compare.component';
import { RouterModule, Routes } from '@angular/router';
import { AutoCompleteModule, BreadcrumbModule, ButtonModule, CardModule, DropdownModule, InputTextModule, MenuModule, MessageModule, TableModule, TooltipModule, DialogModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PagePerformanceFilterModule } from '../../page-performance-filter/page-performance-filter.module';
import { ResourcePerformanceModule } from '../../resource-performance/resource-performance.module';
import { DomainPerformanceModule } from '../../domain-performance/domain-performance.module';
const imports = [
  ResourcePerformanceModule,
  DomainPerformanceModule,
  HeaderModule,
  CommonModule,
  DialogModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  CardModule,
  FormsModule, BreadcrumbModule,
  DropdownModule,
  TableModule,
  MenuModule,
  TooltipModule,
  ChartModule,
  AutoCompleteModule,
  PagePerformanceFilterModule
]

const routes: Routes = [
  {
    path: 'performance-details-compare',
    component: PerformanceDetailsCompareComponent,
  },
];

const components = [PerformanceDetailsCompareComponent];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class PerformanceDetailsCompareModule { }
