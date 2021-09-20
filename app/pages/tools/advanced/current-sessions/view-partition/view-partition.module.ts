import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPartitionComponent } from './view-partition.component';
import { RouterModule, Routes } from '@angular/router';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, TableModule, ToastModule, MessageModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { CurrentSessionFilterModule } from '../current-sessions-filter/current-session-filter.module';

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
  CurrentSessionFilterModule
];

const components = [ViewPartitionComponent];


const routes: Routes = [
  {
    path: 'view-partition',
    component: ViewPartitionComponent,
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
export class ViewPartitionModule { }
