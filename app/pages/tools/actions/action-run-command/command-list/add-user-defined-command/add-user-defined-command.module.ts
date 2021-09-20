import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserDefinedCommandComponent } from './add-user-defined-command.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, TableModule } from 'primeng';
import { AddActionModule } from 'src/app/pages/my-library/alert/alert-actions/add-action/add-action.module';
import { AdvancedConfigurationModule } from 'src/app/pages/my-library/alert/alert-configuration/advanced-configuration/advanced-configuration.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';


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
  AddActionModule,
  AdvancedConfigurationModule,
  TableModule,
  PipeModule
]

const components = [AddUserDefinedCommandComponent];

const routes: Routes = [
  {
    path: 'add-user-defined-command',
    component: AddUserDefinedCommandComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUserDefinedCommandModule { }
