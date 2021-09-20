import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFlowmapComponent } from './transaction-flowmap.component';
import { RouterModule, Routes } from '@angular/router';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { BreadcrumbModule, ButtonModule, CardModule, MenuModule, MessageModule, OrderListModule, OverlayPanelModule, SliderModule, ToastModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { OutputNodeIndicesModule } from './output-node-indices/output-node-indices.module';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { ClusterModule } from './cluster/cluster.module';
import { TransactionFlowpathDetailsModule } from './transaction-flowpath-details/transaction-flowpath-details.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { LastLevelNodeModule } from './last-level-node/last-level-node.module';

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
  LastLevelNodeModule
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
})
export class TransactionFlowmapModule { }
