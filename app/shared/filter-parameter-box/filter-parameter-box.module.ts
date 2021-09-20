import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterParameterBoxComponent } from './filter-parameter-box.component';
import {
  ButtonModule,
  DialogModule,
  InputTextModule,
  CheckboxModule,
  DropdownModule,
  MultiSelectModule
} from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  ButtonModule,
  FormsModule,
  DialogModule,
  DropdownModule,
  MultiSelectModule
];

const components = [FilterParameterBoxComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class FilterParameterBoxModule {}
