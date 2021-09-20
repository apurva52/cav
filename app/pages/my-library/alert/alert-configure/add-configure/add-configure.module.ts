import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AddConfigureComponent}  from '../add-configure/add-configure.component';
import { FormsModule } from '@angular/forms';
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
  ToastModule
} from 'primeng';



const components = [AddConfigureComponent];

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
  InputNumberModule
];

const declaration = [AddConfigureComponent];

@NgModule({
  declarations: [declaration],
  imports: [imports],
  exports: [declaration],
})
export class AddConfigureModule { }
