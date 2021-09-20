import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, PanelModule, RadioButtonModule } from 'primeng';
import { CommonStatsFilterModule } from '../shared/common-stats-filter/common-stats-filter.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { SqlSessionLockComponent } from './sql-session-locking.component';

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
  PipeModule
];
const components = [SqlSessionLockComponent];
const routes: Routes = [
  {
    path: 'sql-session-locking',
    component: SqlSessionLockComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule,components],
})

export class SqlSessionLockModule { }
