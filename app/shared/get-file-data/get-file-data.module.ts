import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetFileDataComponent } from './get-file-data.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  DialogModule,
  InputTextModule,
  TooltipModule,
  ToastModule,
  RadioButtonModule,
  FileUploadModule,
  DropdownModule,
  ConfirmDialogModule,
} from 'primeng';
import { InformativeDialogModule } from '../dialogs/informative-dialog/informative-dialog.module';
import { FileManagerModule } from '../file-manager/file-manager.module';


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
  DropdownModule,
  ConfirmDialogModule
];

const components = [GetFileDataComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class GetFileDataModule {}
