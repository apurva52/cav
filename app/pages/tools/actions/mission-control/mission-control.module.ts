import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MissionControlComponent } from './mission-control.component';
import { MemleakAnalyzerComponent } from './memleak-analyzer/memleak-analyzer.component';
import { NewMemleakAnalysisComponent } from './new-memleak-analysis/new-memleak-analysis.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, TableModule, ToastModule, MessageModule, AccordionModule, DialogModule, TabViewModule, Breadcrumb, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { HighchartsChartModule } from 'highcharts-angular';


const routes: Routes = [
  {
    path: 'mission-control/:name',
    component: MissionControlComponent,
    // children: [
    //   {
    //     path: '',
    //     redirectTo: '/memleak-analyzer',
    //     pathMatch: 'full',
    //   },
    //   {
    //     path: 'memleak-analyzer',
    //     loadChildren: () =>
    //       import('./memleak-analyzer/memleak-analyzer.module').then(
    //         (m) => m.MemleakAnalyzerModule
    //       ),
    //     component: MemleakAnalyzerComponent,
    //   },
    //   {
    //     path: 'memleak-analysis',
    //     loadChildren: () =>
    //       import('./new-memleak-analysis/new-memleak-analysis.module').then(
    //         (m) => m.NewMemleakAnalysisModule
    //       ),
    //     component: NewMemleakAnalysisComponent,
    //   },
    // ],
  }, {
    path: 'flight-recording/:name',
    component: MissionControlComponent
  }
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
  TooltipModule
];

const components = [MissionControlComponent];
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
export class MissionControlModule {}




