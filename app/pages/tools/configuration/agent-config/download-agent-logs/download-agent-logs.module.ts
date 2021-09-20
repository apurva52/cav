import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadAgentLogsComponent } from './download-agent-logs.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { CardModule, TabMenuModule, InputTextModule, RadioButtonModule, DropdownModule, MessageModule, ButtonModule, AccordionModule, CheckboxModule, TreeModule, ToolbarModule, MultiSelectModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, TableModule, ToastModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';


const imports = [
  CommonModule,
  CardModule,
  TabMenuModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  MessageModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  FormsModule,
  ButtonModule,
  AccordionModule,
  CheckboxModule,
  TreeModule,
  ToolbarModule,
  HeaderModule,
  MultiSelectModule,
  PanelModule,
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FieldsetModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,
  

];
const components = [
  DownloadAgentLogsComponent
];
const routes: Routes = [
  {
    path: 'app-download-agent-logs',
    component: DownloadAgentLogsComponent,

  }
];

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
export class DownloadAgentLogsModule { }

