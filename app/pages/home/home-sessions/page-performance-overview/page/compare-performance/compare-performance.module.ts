import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComparePerformanceComponent } from './compare-performance.component';
import { ButtonModule, CardModule, DropdownModule, InputTextModule, MenuModule, RadioButtonModule, TableModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PerformanceDetailsModule } from '../performance-details/performance-details.module';
import { PagePerformanceFilterModule } from '../page-performance-filter/page-performance-filter.module';
const imports = [
  PerformanceDetailsModule,
  PagePerformanceFilterModule,
  ChartModule,
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  TooltipModule,
  FormsModule,
  InputTextModule,
  TableModule,
  DropdownModule,
  MenuModule,
  RadioButtonModule
]

const routes: Routes = [
  {
    path: 'compare-performance',
    component: ComparePerformanceComponent,
  },
];

const components = [ComparePerformanceComponent];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class ComparePerformanceModule { }
