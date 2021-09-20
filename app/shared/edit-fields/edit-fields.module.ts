import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditFieldsComponent } from './edit-fields.component';
import { DropdownModule, ButtonModule, DialogModule, InputNumberModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  ButtonModule,
  FormsModule,
  DialogModule,
  DropdownModule,
  InputNumberModule,
   
];

const components = [
  EditFieldsComponent
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
export class EditFieldsModule { }
