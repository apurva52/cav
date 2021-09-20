import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, TableModule, ToastModule, MessageModule, AccordionModule, DialogModule, TabViewModule, TooltipModule, TreeTableModule, SelectButtonModule, ProgressBarModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { MemoryProflingSessionsComponent } from "./memory-profiling-sessions.component";
import { ClipboardModule } from '@angular/cdk/clipboard';

const routes: Routes = [
  {
    path: 'memory-profiler',
    component: MemoryProflingSessionsComponent,
  }, 
];

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
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
  FieldsetModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,
  MessageModule,
  AccordionModule,
  DialogModule,
  TabViewModule,
  FieldsetModule,
  HighchartsChartModule,
  TableModule,
  TooltipModule,
  TreeTableModule,
  SelectButtonModule,
  ProgressBarModule,
  ClipboardModule
];

const components = [MemoryProflingSessionsComponent];
@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)       
  ],
  exports: [
    RouterModule
  ]
})
export class MemoryProfilingSessionsModule {}




