import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrillDownDbReportComponent } from './drilldown-db-report.component';
import { Routes, RouterModule } from '@angular/router';
import {
  OrderListModule,
  PanelModule,
  TableModule,
  MenuModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  DropdownModule,
  InputTextModule,PaginatorModule, DialogModule, AccordionModule, ToolbarModule, BlockUIModule,
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { CommonServices } from '../../../tools/actions/dumps/service/common.services';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DdrBreadcrumbService } from '../../../tools/actions/dumps/thread-dump/service/ddr-breadcrumb.service';
import { DDRRequestService } from '../../../tools/actions/dumps/service/ddr-request.service';
import { MessageService } from '../../../tools/actions/dumps/thread-dump/service/ddr-message.service';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  DropdownModule,
  OrderListModule,
  PanelModule,
  MenuModule,
  InputTextModule,
  PaginatorModule,
  PipeModule,
  ChartModule,
  DialogModule,
  AccordionModule,
  HighchartsChartModule,
  ToolbarModule,
  BlockUIModule,

];

const components = [
  DrillDownDbReportComponent
];

const routes: Routes = [
  {
    path: 'drilldown-db-report',
    component: DrillDownDbReportComponent
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
  ],
  providers: [CommonServices, CavConfigService, CavTopPanelNavigationService, DdrDataModelService, DdrBreadcrumbService, DDRRequestService, MessageService]
})
export class DrillDownDbReportModule { }
