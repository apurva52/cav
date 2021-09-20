import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeadlocksComponent } from './deadlocks.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonStatsFilterModule } from '../../shared/common-stats-filter/common-stats-filter.module';
import { ButtonModule, CardModule, ChartModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, TableModule, TooltipModule, TreeTableModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';



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
  PipeModule,
  PanelModule
];
const components = [DeadlocksComponent];
const routes: Routes = [
  {
    path: 'deadlocks',
    component: DeadlocksComponent
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeadlocksModule { }
