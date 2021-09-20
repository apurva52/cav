import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDataCrudComponent } from './custom-data-crud.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';

const components = [
  CustomDataCrudComponent
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
  MultiSelectModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class CustomDataCrudModule { }
