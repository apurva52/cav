import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetSettingComponent } from './widget-setting.component';
import { FormsModule } from '@angular/forms';
import {
  DialogModule,
  ButtonModule,
  InputTextModule,
  CheckboxModule,
  DropdownModule,
  MultiSelectModule,
  FieldsetModule,
  ColorPickerModule,
  RadioButtonModule,
  AccordionModule,
  InputTextareaModule
} from 'primeng';
import { ChartModule } from '../chart/chart.module';

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  InputTextModule,
  CheckboxModule,
  FormsModule,
  DropdownModule,
  MultiSelectModule,
  FieldsetModule,
  ColorPickerModule,
  RadioButtonModule,
  AccordionModule,
  InputTextareaModule,
  ChartModule
];

const components = [
  WidgetSettingComponent
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
export class WidgetSettingModule { }
