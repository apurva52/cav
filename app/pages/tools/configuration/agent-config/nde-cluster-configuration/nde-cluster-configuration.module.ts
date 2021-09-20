import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NdeClusterConfigurationComponent } from './nde-cluster-configuration.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, ChartModule, TableModule, TooltipModule, MessageModule } from 'primeng';

import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AddNdeServerModule } from './add-nde-server/add-nde-server.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,  
  PanelModule, 
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  MessageModule,
  TableModule,
  TooltipModule,
  ChartModule,
  PipeModule,
  AddNdeServerModule
];

const components = [NdeClusterConfigurationComponent];

const routes: Routes = [
  {
    path: 'nde-cluster-configuration',
    component: NdeClusterConfigurationComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class NdeClusterConfigurationModule {}


