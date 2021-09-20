import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertActionsComponent } from './alert-actions.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, DialogModule, InputTextModule, MenuModule, MessageModule, MessageService, MultiSelectModule, ProgressBarModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AddActionModule } from './add-action/add-action.module';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AlertActionHistoryModule } from '../alert-action-history/alert-action-history.module';
import { GenericImportExportModule } from 'src/app/shared/generic-import-export/generic-import-export.module';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  ConfirmDialogModule,
  ConfirmationDialogModule,
  PipeModule,
  DialogModule,
  FormsModule,
  MenuModule,
  InputTextModule,
  GenericImportExportModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  AddActionModule,
  ProgressBarModule,
  AlertActionHistoryModule
]

const components = [AlertActionsComponent];

const routes: Routes = [
  {
    path: 'alert-actions',
    component: AlertActionsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertActionsModule { }
