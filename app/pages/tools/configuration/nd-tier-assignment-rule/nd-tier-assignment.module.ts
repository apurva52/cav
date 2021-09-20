import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NDTierAssignmentRuleComponent } from './nd-tier-assignment-rule.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, ProgressBarModule, RadioButtonModule, TableModule, ToastModule, ToolbarModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ClassicDashboardModule } from '../../advanced/current-sessions/classic-dashboard/classic-dashboard.module';
import { CurrentSessionFilterModule } from '../../advanced/current-sessions/current-sessions-filter/current-session-filter.module';
import { ViewPartitionModule } from '../../advanced/current-sessions/view-partition/view-partition.module';

// import { AddTierGroupModule } from './add-tier-group/add-tier-group.module';


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
  DropdownModule,
  ToastModule,
  DialogModule,
  ConfirmDialogModule,
  ProgressBarModule
  
  // AddTierGroupModule
];

const components = [NDTierAssignmentRuleComponent];


const routes: Routes = [
  {
    path: 'nd-tier-assignment-rule',
    component: NDTierAssignmentRuleComponent,
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
export class NDTierAssignmentModule { }
