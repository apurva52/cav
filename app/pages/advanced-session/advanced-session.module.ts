import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AuditLogFiltersModule } from '../audit-logs/audit-log-filters/audit-log-filters.module';
import { AdvancedSessionComponent } from './advanced-session.component';
import { ProjectFilterModule } from './project-filter/project-filter.module';
import { CompareSettingComponent } from './compare-setting/compare-setting.component';
import { CompareSettingModule } from './compare-setting/compare-setting.module';


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
  ProjectFilterModule,
  CompareSettingModule
];

const components = [AdvancedSessionComponent];

const routes: Routes = [
  {
    path: 'advanced-session',
    component: AdvancedSessionComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AdvancedSessionModule { }
