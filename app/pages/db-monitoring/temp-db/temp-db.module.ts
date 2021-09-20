import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TempDBComponent } from './temp-db.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CommonStatsFilterModule } from '../shared/common-stats-filter/common-stats-filter.module';

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
  PipeModule,
  CommonStatsFilterModule,
  PanelModule
];
const components = [TempDBComponent];
const routes: Routes = [
  {
    path: 'temp-db',
    component: TempDBComponent
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TempDBModule { }
