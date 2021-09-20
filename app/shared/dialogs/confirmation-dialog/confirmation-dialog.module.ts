import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { ButtonModule, CheckboxModule, DialogModule,InputTextModule,TooltipModule } from 'primeng';



const components = [
  ConfirmationDialogComponent
];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  InputTextModule,
  TooltipModule,
  FormsModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class ConfirmationDialogModule { }
