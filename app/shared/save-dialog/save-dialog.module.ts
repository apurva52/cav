import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveDialogComponent } from './save-dialog.component';
import { ButtonModule, MessageModule, CheckboxModule, DialogModule, InputTextModule, ConfirmDialogModule } from 'primeng';
import { HeaderModule } from '../header/header.module';
import { FormsModule } from '@angular/forms'

const components = [
  SaveDialogComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  FormsModule,
  MessageModule,
  ConfirmDialogModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})

export class SaveDialogModule { }
