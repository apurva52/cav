import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrillDownTransactionsGroupComponent } from './drilldown-transactions-group.component';
import { RouterModule, Routes } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';

import {
  TableModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  DropdownModule,
  MenuModule,
  OrderListModule,
  SlideMenuModule,
  InputTextModule,
  BreadcrumbModule,
  ToolbarModule,
  BlockUIModule,
  AccordionModule,
  DialogModule,
  ProgressBarModule,
  PaginatorModule
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  DropdownModule,
  OrderListModule,
  SlideMenuModule,
  MenuModule,
  InputTextModule,
  BreadcrumbModule,
  PipeModule,
  ToolbarModule,
  BlockUIModule,
  AccordionModule,
  DialogModule,
  ProgressBarModule,
  PaginatorModule,
  HighchartsChartModule
];

const components = [DrillDownTransactionsGroupComponent];

const routes: Routes = [
  {
    path: 'drilldown-transactions-group',
    component: DrillDownTransactionsGroupComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrillDownTransactionsGroupModule { }
