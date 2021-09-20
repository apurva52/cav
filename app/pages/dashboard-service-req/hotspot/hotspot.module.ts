import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotspotComponent } from './hotspot.component';
import { Routes, RouterModule } from '@angular/router';
import { GraphPanelModule } from 'src/app/shared/panel/graph/graph-panel/graph-panel.module';
import { TableModule, ButtonModule, MessageModule, TooltipModule, PanelModule, MenuModule, MultiSelectModule, InputTextModule, DialogModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { TreeTableModule } from 'primeng/treetable';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { TableBoxModule } from '../ip-summary/table-box/table-box.module';

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
  InputTextModule,
  ChartModule,
  PipeModule,
  TreeTableModule,
  IpSummaryOpenBoxModule,
  TableBoxModule,
  DialogModule
];

const components = [
  HotspotComponent
];

const routes: Routes = [
  {
    path: 'hotspot',
    component: HotspotComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule, HotspotComponent
  ],
  entryComponents:[HotspotComponent]
})
export class HotspotModule { }
