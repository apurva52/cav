import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddActionComponent } from './add-action.component';
import {
  ButtonModule,
  CardModule,
  CheckboxModule,
  DialogModule,
  DropdownModule,
  FieldsetModule,
  InputNumberModule,
  InputSwitchModule,
  InputTextareaModule,
  InputTextModule,
  PasswordModule,
  RadioButtonModule,
  ToastModule,
  MenuModule
} from 'primeng';
import { FormsModule } from '@angular/forms';

const components = [AddActionComponent];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  CardModule,
  FieldsetModule,
  InputSwitchModule,
  RadioButtonModule,
  PasswordModule,
  ToastModule,
  InputTextareaModule,
  InputNumberModule,
  MenuModule
];

const declarations = [AddActionComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class AddActionModule {}
