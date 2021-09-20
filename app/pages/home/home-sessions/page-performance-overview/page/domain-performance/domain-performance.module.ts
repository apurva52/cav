import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainPerformanceComponent } from './domain-performance.component';
import { RouterModule, Routes } from '@angular/router';
import { AutoCompleteModule, BreadcrumbModule, ToolbarModule, ButtonModule, DialogModule, CardModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PagePerformanceFilterModule } from '../page-performance-filter/page-performance-filter.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { DomainPerformanceCompareComponent } from './domain-performance-compare/domain-performance-compare.component';
import { DomainPerformanceCompareModule } from './domain-performance-compare/domain-performance-compare.module';

const imports = [
  BreadcrumbModule,
  HeaderModule,
  ToolbarModule,
  OwlMomentDateTimeModule,
  OwlDateTimeModule,
  CommonModule,
  DialogModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  CardModule,
  FormsModule,
  DropdownModule,
  TableModule,
  MenuModule,
  TooltipModule,
  ChartModule,
  MultiSelectModule,
  AutoCompleteModule,
  PagePerformanceFilterModule,
  DomainPerformanceCompareModule
]

const routes: Routes = [
  {
    path: 'domain-performance',
    component: DomainPerformanceComponent,
  },
];

const components = [DomainPerformanceComponent];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class DomainPerformanceModule { }
