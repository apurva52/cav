import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertRulesComponent } from './alert-rules.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule, CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, DialogModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, InputSwitchModule, ConfirmDialogModule, ConfirmationService, OverlayPanelModule, FieldsetModule, ProgressBarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AlertConfigurationModule } from './alert-configuration/alert-configuration.module';
import { MessageService } from 'primeng/api';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { GenericImportExportModule } from 'src/app/shared/generic-import-export/generic-import-export.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  MenuModule, 
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule,
  GenericImportExportModule,
  InputSwitchModule,
  FormsModule,
  DialogModule,
  ConfirmDialogModule,
  OverlayPanelModule,
  FieldsetModule,
  AlertConfigurationModule,
  ConfirmationDialogModule,
  ProgressBarModule,
  PipeModule
]

const components = [AlertRulesComponent];

const routes: Routes = [
  {
    path: 'alert-rules',
    component: AlertRulesComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MessageService, ConfirmationService],
})
export class AlertRulesModule { }
