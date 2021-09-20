import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadFileComponent } from './download-file.component';
import { ButtonModule, DialogModule, InputTextModule, TooltipModule, ToastModule, RadioButtonModule, FileUploadModule } from 'primeng';
import { FileManagerModule } from '../file-manager/file-manager.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InformativeDialogModule } from '../dialogs/informative-dialog/informative-dialog.module';
// import { ConfirmationDialogModule } from '../dialogs/confirmation-dialog/confirmation-dialog.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';

const imports = [
  CommonModule,
  ButtonModule,
  DialogModule,
  InputTextModule,
  FileManagerModule,
  FormsModule,
  ReactiveFormsModule,
  TooltipModule,
  ToastModule,
  InformativeDialogModule,
  RadioButtonModule,
  FileUploadModule,
  ConfirmDialogModule
];

const components = [
  DownloadFileComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class DownloadFileModule { }

