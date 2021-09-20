import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TierGroupComponent } from './tier-group.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, FieldsetModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, ToastModule, ToolbarModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ClassicDashboardModule } from '../../advanced/current-sessions/classic-dashboard/classic-dashboard.module';
import { CurrentSessionFilterModule } from '../../advanced/current-sessions/current-sessions-filter/current-session-filter.module';
import { ViewPartitionModule } from '../../advanced/current-sessions/view-partition/view-partition.module';
import { AddTierGroupModule } from './add-tier-group/add-tier-group.module';

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
  CurrentSessionFilterModule,
  ViewPartitionModule,
  ClassicDashboardModule,
  AddTierGroupModule
];

const components = [TierGroupComponent];


const routes: Routes = [
  {
    path: 'tier-group',
    component: TierGroupComponent,
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
export class TierGroupModule { }
