import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTemplateDialogComponent } from './custom-template-dialog.component';
import { FormsModule } from '@angular/forms';
import {
  ButtonModule,
  ConfirmDialogModule,
  DialogModule,
  InputTextModule,
  MessageModule,
  ProgressSpinnerModule,
  ToastModule,
} from 'primeng';

const imports = [
  CommonModule,
  ButtonModule,
  FormsModule,
  DialogModule,
  InputTextModule,
  MessageModule,
  ConfirmDialogModule,
  ProgressSpinnerModule,
  ToastModule,
  MessageModule
];

const components = [CustomTemplateDialogComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class CustomTemplateDialogModule {}
