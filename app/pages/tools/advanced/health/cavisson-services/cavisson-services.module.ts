import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CavissonServicesComponent } from './cavisson-services.component';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { BreadcrumbModule, ButtonModule, CardModule, DropdownModule, InputTextModule, MenuModule, MultiSelectModule, OverlayPanelModule, PanelModule, TableModule, ToolbarModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ProcessInfoModule } from './process-info/process-info.module';
import { CommandExecutionModule } from './command-execution/command-execution.module';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  MultiSelectModule,
  PanelModule, 
  BreadcrumbModule,
  MenuModule,
  FormsModule,
  TableModule,
  AppMessageModule,
  PipeModule,
  InputTextModule,
  DropdownModule,
  ConfirmationDialogModule,
  ConfigurationModule,
  ProcessInfoModule,
  CommandExecutionModule,
  OverlayPanelModule
];

const components = [CavissonServicesComponent];

const routes: Routes = [
{
  path: 'cavisson-services',
  component: CavissonServicesComponent,
}
];

@NgModule({
declarations: [components],
imports: [
  imports,
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class CavissonServicesModule { }
