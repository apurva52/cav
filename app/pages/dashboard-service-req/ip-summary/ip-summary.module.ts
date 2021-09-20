import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OrderListModule,
  PanelModule,
  TableModule,
  SplitButtonModule,
  MenuModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  DropdownModule,
  DialogModule,
  ToolbarModule,
  SlideMenuModule,
  InputTextModule,
  OverlayPanelModule,
} from 'primeng';
import { IpSummaryComponent } from './ip-summary.component';
import { Routes, RouterModule } from '@angular/router';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { KpiGraphicalModule } from '../../kpi/kpi-graphical/kpi-graphical.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { KpiRevenueModule } from '../../kpi/kpi-revenue/kpi-revenue.module';
import { KpiTimeFilterModule } from 'src/app/shared/kpi-time-filter/kpi-time-filter.module';
import { WidgetMenuModule } from 'src/app/shared/dashboard/widget/widget-menu/widget-menu.module';
import { TableBoxModule } from './table-box/table-box.module';
import { DiagnosticsConfigurationModule } from 'src/app/shared/diagnostics-configuration/diagnostics-configuration.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CommonComponentsModule } from '../../../shared/common-config-module';

const imports = [
  CommonModule,
  PanelModule,
  ButtonModule,
  TableModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  MenuModule,
  MultiSelectModule,
  SlideMenuModule,
  DialogModule,
  CheckboxModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  DialogModule,
  InputTextModule,
  DropdownModule,
  OverlayPanelModule,
  WidgetMenuModule,
  TableBoxModule,
  IpSummaryOpenBoxModule,
  PipeModule,
  CommonComponentsModule
];

const components = [
  IpSummaryComponent
];
const routes: Routes = [
  {
    path: 'ip-summary',
    component: IpSummaryComponent
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
export class IpSummaryModule { }