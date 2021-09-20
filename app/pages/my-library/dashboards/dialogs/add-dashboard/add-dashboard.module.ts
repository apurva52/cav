import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDashboardComponent } from './add-dashboard.component';
import { FormsModule } from '@angular/forms';
import {
  DropdownModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  ProgressSpinnerModule,
  ConfirmDialogModule,
  ToastModule, MessageModule
} from 'primeng';
import { FileManagerModule } from 'src/app/shared/file-manager/file-manager.module';
import { InformativeDialogModule } from 'src/app/shared/dialogs/informative-dialog/informative-dialog.module';

const imports = [
  CommonModule,
  InformativeDialogModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  ProgressSpinnerModule,
  ConfirmDialogModule,
  FileManagerModule,
  ToastModule,
  MessageModule
];

const components = [AddDashboardComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class AddDashboardModule {}
