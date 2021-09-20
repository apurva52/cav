import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceDetailsComponent } from './performance-details.component';
import { RouterModule, Routes } from '@angular/router';
import { AutoCompleteModule, BreadcrumbModule, ButtonModule, CardModule, ToolbarModule, DropdownModule, InputTextModule, MenuModule, MessageModule, TableModule, TooltipModule, DialogModule, ToggleButtonModule, TabMenuModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PagePerformanceFilterModule } from '../page-performance-filter/page-performance-filter.module';
import { ResourcePerformanceModule } from '../resource-performance/resource-performance.module';
import { DomainPerformanceModule } from '../domain-performance/domain-performance.module';
import { ResourcePerformanceCompareModule } from '../resource-performance/resource-performance-compare/resource-performance-compare.module';
import { DomainPerformanceCompareModule } from '../domain-performance/domain-performance-compare/domain-performance-compare.module';
import { PerformanceDetailsCompareModule } from './performance-details-compare/performance-details-compare.module';
const imports = [
  ToolbarModule,
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
  PagePerformanceFilterModule,
  TabMenuModule,
  ToggleButtonModule,
  ResourcePerformanceCompareModule,
  DomainPerformanceCompareModule,
  PerformanceDetailsCompareModule
]

const routes: Routes = [
  {
    path: 'performance-details',
    component: PerformanceDetailsComponent,
  },
];

const components = [PerformanceDetailsComponent];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class PerformanceDetailsModule { }
