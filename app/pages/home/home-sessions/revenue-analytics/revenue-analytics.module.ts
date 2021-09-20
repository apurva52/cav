import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevenueAnalyticsComponent } from './revenue-analytics.component';
import { Routes, RouterModule } from '@angular/router';
import {  CarouselModule, CardModule, AccordionModule, CheckboxModule, BreadcrumbModule, ButtonModule, DialogModule, DropdownModule, InputSwitchModule, 
  InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, ToolbarModule, 
  TooltipModule, SidebarModule, ToastModule, ProgressBarModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RevenueAnalyticsFilterComponent } from './revenue-analytics-filter/revenue-analytics-filter.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { TimeFilterModule } from 'src/app/shared/time-filter/time-filter/time-filter.module';

const imports = [
  ToastModule,
  CommonModule,
  ChartModule,
  CarouselModule,
  CardModule,
  AccordionModule,
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,  
  PanelModule, 
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  MessageModule,
  DialogModule,
  TableModule,
  TooltipModule,
  SidebarModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  ReactiveFormsModule,
  TimeFilterModule,
  ProgressBarModule
];

const components = [
  RevenueAnalyticsComponent
];
const routes: Routes = [
  {
    path: 'revenue-analytics',
    component: RevenueAnalyticsComponent,
  }
];

@NgModule({
  declarations: [components, RevenueAnalyticsFilterComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
})
export class RevenueAnalyticsModule { }
