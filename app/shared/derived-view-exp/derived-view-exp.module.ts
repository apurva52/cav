import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DerivedViewExpComponent } from './derived-view-exp.component';
import { FormsModule } from '@angular/forms';
import {
  DropdownModule,
  InputTextModule,
  ButtonModule, DialogModule, PanelModule, InputTextareaModule, MultiSelectModule, RadioButtonModule
} from 'primeng';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  FormsModule,
  InputTextModule,
  DropdownModule,
  MultiSelectModule,
  ConfirmDialogModule,
  PanelModule,
  InputTextareaModule
];

const components = [
  DerivedViewExpComponent
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

export class DerivedViewExpModule { }
