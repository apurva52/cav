import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewVariationComponent } from './add-new-variation.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, OrderListModule, CardModule, InputTextareaModule, RadioButtonModule, SliderModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const components = [
  AddNewVariationComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule,
  InputTextareaModule,
  RadioButtonModule,
  SliderModule
];

const declarations = [AddNewVariationComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})

export class AddNewVariationModule { }
