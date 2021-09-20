import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaitStatisticsComponent } from './wait-statistics.component';
import {
  ButtonModule,
  CardModule,
  DropdownModule,
  InputTextModule,
  MenuModule,
  MessageModule,
  MultiSelectModule,
  PanelModule,
  TableModule,
  TabMenuModule,
  TabViewModule,
  TooltipModule,
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { Routes, RouterModule } from '@angular/router';
import { CommonStatsFilterModule } from '../shared/common-stats-filter/common-stats-filter.module';
import { SessionWaitStatModule } from './session-wait-stats/session-wait-stats.module';
import { SessionStatModule } from '../session-stats/session-stats.module';
import { WaitStatsModule } from '../wait-stats/wait-stats.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  ChartModule,
  PanelModule,
  TabViewModule,
  TabMenuModule,
  CommonStatsFilterModule,
  SessionWaitStatModule,
  SessionStatModule,
  WaitStatsModule
];
const components = [WaitStatisticsComponent ]
const routes: Routes = [
  {
    path: 'wait-statistics',
    component: WaitStatisticsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class WaitStatisticsModule {}
