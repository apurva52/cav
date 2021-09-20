import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogsComponent } from './audit-logs.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, OverlayPanelModule, SlideMenuModule, SplitButtonModule, TableModule, ToastModule, ToolbarModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AuditLogFiltersModule } from './audit-log-filters/audit-log-filters.module';
import {BlockUIModule} from 'primeng/blockui';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,    
  PipeModule,
  SlideMenuModule,
  MenuModule,
  IpSummaryOpenBoxModule,
  InputTextModule, //conflicts
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule,
  AuditLogFiltersModule,
  SplitButtonModule,
  OverlayPanelModule,
  BlockUIModule
];

const components = [AuditLogsComponent];

const routes: Routes = [
  {
    path: 'audit-logs',
    component: AuditLogsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class AuditLogsModule {}
