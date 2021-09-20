import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformativeDialogComponent } from './informative-dialog.component';
import { ButtonModule, DialogModule } from 'primeng';

const components = [
  InformativeDialogComponent
];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],

  exports: [components]
})
export class InformativeDialogModule { }
