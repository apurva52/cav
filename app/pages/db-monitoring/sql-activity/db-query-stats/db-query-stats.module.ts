import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, PanelModule, RadioButtonModule } from 'primeng';
import { DBQueryStatsComponent } from './db-query-stats.component';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';
import { DbQueryStatsFilterModule } from './db-query-stats-filter/db-query-stats-filter.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { SequenceDiagramModule } from 'src/app/pages/dashboard-service-req/sequence-diagram/sequence-diagram.module';
import { ExecutionPlanDiagramModule } from './execution-plan-diagram/execution-plan-diagram.module';
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
  PanelModule,
  RadioButtonModule,
  AceEditorModule,
  DbQueryStatsFilterModule,
  SequenceDiagramModule,
  ExecutionPlanDiagramModule,
  PipeModule
];
const components = [DBQueryStatsComponent];
const routes: Routes = [
  {
    path: 'db-query-stats',
    component: DBQueryStatsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DBQueryStatsModule { }
