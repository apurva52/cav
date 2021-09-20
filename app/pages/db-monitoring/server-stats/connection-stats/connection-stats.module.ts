import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionStatsComponent } from './connection-stats.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, PanelModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CommonStatsFilterModule } from '../../shared/common-stats-filter/common-stats-filter.module';


const imports = [
  CommonModule,
  TableModule, 
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  PanelModule,
  ChartModule,
  PipeModule,
  CommonStatsFilterModule
];
const components = [ConnectionStatsComponent];
const routes: Routes = [
  {
    path: 'connection-stats',
    component: ConnectionStatsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionStatsModule { }
