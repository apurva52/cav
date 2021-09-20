import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SessionWaitStatsComponent } from './session-wait-stats.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule } from 'primeng';
import { WaitStatsComponent } from './wait-stats.component';
import { CommonStatsFilterModule } from '../shared/common-stats-filter/common-stats-filter.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';



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
  CommonStatsFilterModule,
  ChartModule,
  PipeModule
];
const components = [
  WaitStatsComponent
];
const routes: Routes = [
  {
    path: 'add-wait-stats',
    component: WaitStatsComponent
  }
];
@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    components
  ]
})
export class WaitStatsModule { }
