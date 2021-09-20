import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseComponent } from './database.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { CommonStatsFilterModule } from '../shared/common-stats-filter/common-stats-filter.module';
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
  ChartModule,
  CommonStatsFilterModule,
  PipeModule
];
const components = [DatabaseComponent];
const routes: Routes = [
  {
    path: 'database',
    component: DatabaseComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DatabaseModule { }
