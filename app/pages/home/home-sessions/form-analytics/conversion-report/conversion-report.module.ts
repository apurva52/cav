import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionReportComponent } from './conversion-report.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CarouselModule, CardModule, AccordionModule, ToolbarModule, ButtonModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, MessageModule, DialogModule, TableModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { FormAnalyticsFilterModule } from '../form-analytics-filter/form-analytics-filter.module';


const imports = [
  FormAnalyticsFilterModule,
  CommonModule,
  ChartModule,
  CarouselModule,
  CardModule,
  AccordionModule,
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
];

const components = [
  ConversionReportComponent
];
const routes: Routes = [
  {
    path: 'revenue-analytics',
    component: ConversionReportComponent,
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule, components
  ]
})
export class ConversionReportModule { }