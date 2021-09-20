import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import {
  TableModule,
  BreadcrumbModule,
  DialogModule,
  ButtonModule,
  InputTextModule,
  CheckboxModule,
  CardModule,
  ToastModule,
  FileUploadModule,
  TooltipModule,
} from 'primeng';
import { LocalFileUploadModule } from '../local-file-upload/local-file-upload.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '../pipes/pipes.module';
import { UploadFileModule } from '../upload-file/upload-file.module';
import { InformativeDialogModule } from '../dialogs/informative-dialog/informative-dialog.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
// import { DownloadFileModule } from '../download-file/download-file.module';

const imports = [
  CommonModule,
  TableModule,
  BreadcrumbModule,
  DialogModule,
  ButtonModule,
  InputTextModule,
  CheckboxModule,
  LocalFileUploadModule,
  CardModule,
  FormsModule,
  PipeModule,
  ReactiveFormsModule,
  UploadFileModule,
  ToastModule,
  FileUploadModule,
  TooltipModule,
  InformativeDialogModule,
  ConfirmDialogModule
];

const components = [
  FileManagerComponent
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
export class FileManagerModule { }
