import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregateTransactionFlowmapComponent } from './aggregate-transaction-flowmap.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, MenuModule, OrderListModule, OverlayPanelModule, SliderModule, ToolbarModule } from 'primeng';
import { CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FlowpathDetailsModule } from './flowpath-details/flowpath-details.module';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { OutputNodeIndicesModule } from './output-node-indices/output-node-indices.module';
import { ClusterModule } from './cluster/cluster.module';
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
  FlowpathDetailsModule,
  BreadcrumbModule,
  jsPlumbToolkitModule,
  OutputNodeIndicesModule,
  ClusterModule,
  OverlayPanelModule,
  SliderModule,
  LastLevelNodeModule
];

const components = [AggregateTransactionFlowmapComponent];

const routes: Routes = [
  {
    path: 'aggregate-transaction-flowmap',
    component: AggregateTransactionFlowmapComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AggregateTransactionFlowmapModule { }
