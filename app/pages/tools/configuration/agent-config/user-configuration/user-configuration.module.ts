import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserConfigurationComponent } from './user-configuration.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, MessageModule, TableModule, TooltipModule, ChartModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AddNdeServerModule } from '../nde-cluster-configuration/add-nde-server/add-nde-server.module';
import { AddSettingsModule } from './add-settings/add-settings.module';

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
  AddSettingsModule
];

const components = [UserConfigurationComponent];

const routes: Routes = [
  {
    path: 'nde-cluster-configuration',
    component: UserConfigurationComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class UserConfigurationModule {}
