import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CompareHotspotComponent } from './compare-hotspot.component';
import { Routes, RouterModule } from '@angular/router';
import { GraphPanelModule } from 'src/app/shared/panel/graph/graph-panel/graph-panel.module';
import { TableModule, ButtonModule, MessageModule, TooltipModule, PanelModule, MenuModule, MultiSelectModule, InputTextModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { TreeTableModule } from 'primeng/treetable';


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
  TreeTableModule
];

const components = [
  // HotspotComponent
];

const routes: Routes = [
  // {
  //   path: 'compare-hotspot',
  //   // component: CompareHotspotComponent
  // }
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
export class AggIpInfoModule { }
