import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsVersionComponent } from './os-version.component';
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

const components = [OsVersionComponent];
const routes: Routes = [
  {
    path: 'os-version',
    component: OsVersionComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OsVersionModule { }
