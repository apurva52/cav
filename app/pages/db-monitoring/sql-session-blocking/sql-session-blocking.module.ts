import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, PanelModule, RadioButtonModule, TreeTableModule } from 'primeng';
import { CommonStatsFilterModule } from '../shared/common-stats-filter/common-stats-filter.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { SqlSessionBlockingComponent } from './sql-session-blocking.component';

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
  RadioButtonModule,
  ChartModule,
  CommonStatsFilterModule,
  PipeModule,
  TreeTableModule
];
const components = [SqlSessionBlockingComponent];
const routes: Routes = [
  {
    path: 'sql-session-blocking',
    component: SqlSessionBlockingComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule,components],
})

export class SqlSessionBlockingModule { }
