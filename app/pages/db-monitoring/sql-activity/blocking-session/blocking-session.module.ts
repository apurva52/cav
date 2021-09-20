import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockingSessionComponent } from './blocking-session.component';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { ButtonModule, CardModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, TableModule, TooltipModule, TreeTableModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { CommonStatsFilterModule } from '../../shared/common-stats-filter/common-stats-filter.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  InputTextModule,
  ButtonModule,
  ChartModule,
  TreeTableModule,
  CommonStatsFilterModule,
  PanelModule
];
const components = [BlockingSessionComponent];
const routes: Routes = [
  {
    path: 'blocking-session',
    component: BlockingSessionComponent
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockingSessionModule { }
