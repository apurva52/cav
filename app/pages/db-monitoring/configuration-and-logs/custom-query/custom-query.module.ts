import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, RatingModule, TableModule, TabMenuModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { CommonStatsFilterModule } from '../../shared/common-stats-filter/common-stats-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CustomQueryComponent } from './custom-query.component';
import { DbQueryStatsFilterModule } from '../../sql-activity/db-query-stats/db-query-stats-filter/db-query-stats-filter.module';
// import {GrowlModule} from 'growl';

const imports = [
  CommonModule,
  TabMenuModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
  RadioButtonModule,
  RatingModule,
  CommonStatsFilterModule,
  PipeModule,
  ToolbarModule,
  PanelModule,
  DbQueryStatsFilterModule
]

const components = [CustomQueryComponent];

const routes: Routes = [
  {
    path: 'custom-query',
    component: CustomQueryComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule,components],
})

export class CustomQueryModule { }
