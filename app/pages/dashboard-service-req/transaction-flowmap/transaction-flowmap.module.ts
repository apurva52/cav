import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFlowmapComponent } from './transaction-flowmap.component';
import { RouterModule, Routes } from '@angular/router';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { BreadcrumbModule, ButtonModule, CardModule, MenuModule, MessageModule, OrderListModule, OverlayPanelModule, SliderModule, ToastModule, ToolbarModule, TooltipModule, DialogModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { OutputNodeIndicesModule } from './output-node-indices/output-node-indices.module';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { ClusterModule } from './cluster/cluster.module';
import { TransactionFlowpathDetailsModule } from './transaction-flowpath-details/transaction-flowpath-details.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { LastLevelNodeModule } from './last-level-node/last-level-node.module';
import { DbQueriesModule } from '../db-queries/db-queries.module';
import { HttpReportModule } from '../http-report/http-report.module';
import { HotspotModule } from '../hotspot/hotspot.module';
import { MethodTimingModule } from '../method-timing/method-timing.module';
import { MethodCallDetailsModule } from '../method-call-details/method-call-details.module';
import { TransactionFlowMapServiceInterceptor } from './service/transaction-flowmap.service.interceptor';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CommonComponentsModule } from '../../../shared/common-config-module';


const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  HeaderModule,
  ToolbarModule,
  OrderListModule,
  MenuModule,
  TransactionFlowpathDetailsModule,
  BreadcrumbModule,
  jsPlumbToolkitModule,
  OutputNodeIndicesModule,
  ClusterModule,
  OverlayPanelModule,
  SliderModule,
  ChartModule,
  LastLevelNodeModule,
  DialogModule,
  DbQueriesModule,
  HttpReportModule,
  HotspotModule,
  MethodTimingModule,
  MethodCallDetailsModule,
  PipeModule,
  CommonComponentsModule
];

const components = [TransactionFlowmapComponent];

const routes: Routes = [
  {
    path: 'transaction-flowmap',
    component: TransactionFlowmapComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[TransactionFlowMapServiceInterceptor]
})
export class TransactionFlowmapModule { }
