import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './system.component';
import { ButtonModule, CardModule, MessageModule, OverlayPanelModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { GridsterModule } from 'angular-gridster2';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { EndToEndGraphicalModule } from '../../end-to-end/end-to-end-graphical/end-to-end-graphical.module';
import { SolarPrefNodeModule } from '../../end-to-end/end-to-end-graphical/solar-pref-node/solar-pref-node.module';
import { OutputNodeModule } from '../../end-to-end/end-to-end-graphical/output-node/output-node.module';

const imports = [
  CommonModule,
  OverlayPanelModule,
  jsPlumbToolkitModule,
  HighchartsChartModule,
  ButtonModule,
  MessageModule,
  RouterModule,
  GridsterModule,
  ChartModule,
  CardModule,
  SolarPrefNodeModule,
  OutputNodeModule
];

const routes: Routes = [
  {
    path: 'system',
    component: SystemComponent,
  },
];
@NgModule({
  declarations: [SystemComponent],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemModule { }

