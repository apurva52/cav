import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddParameterComponent } from './add-parameter.component';
import { ButtonModule, DialogModule, DropdownModule, InputTextModule, RadioButtonModule } from 'primeng';
import { FormsModule } from '@angular/forms';


const components = [AddParameterComponent];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  RadioButtonModule
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class AddParameterModule { }
