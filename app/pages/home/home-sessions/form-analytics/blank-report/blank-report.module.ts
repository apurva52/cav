import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlankReportComponent } from './blank-report.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CarouselModule, CardModule, SidebarModule, AccordionModule, ToolbarModule, ButtonModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, MessageModule, DialogModule, TableModule, TooltipModule, ProgressBarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { FormAnalyticsFilterModule } from '../form-analytics-filter/form-analytics-filter.module';
const imports = [
  FormAnalyticsFilterModule,
  CommonModule,
  CarouselModule,
  CardModule,
  ButtonModule,
  FormsModule,
  MessageModule,
  TooltipModule,
  ProgressBarModule
];

const components = [
  BlankReportComponent
];
const routes: Routes = [
  {
    path: 'blank-report',
    component: BlankReportComponent,
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
export class BlankReportModule { }