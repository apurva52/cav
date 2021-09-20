import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import { AutoCompleteModule, ButtonModule, CardModule, MessagesModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { ComparePerformanceModule } from './compare-performance/compare-performance.module';
import { PerformanceDetailsModule } from './performance-details/performance-details.module';
import { PagePerformanceFilterModule } from './page-performance-filter/page-performance-filter.module';

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
  PagePerformanceFilterModule
];

const components = [PageComponent];

const routes: Routes = [
  {
    path: 'page',
    component: PageComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageModule { }
