import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbQueryLogsComponent } from './db-query-logs.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, RatingModule, TableModule, TabMenuModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { CommonStatsFilterModule } from '../../shared/common-stats-filter/common-stats-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  BreadcrumbModule,
  TooltipModule,
  RadioButtonModule,
  RatingModule,
  CommonStatsFilterModule,
  PipeModule
]

const components = [DbQueryLogsComponent];

const routes: Routes = [
  {
    path: 'db-query-logs',
    component: DbQueryLogsComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DbQueryLogsModule { }
