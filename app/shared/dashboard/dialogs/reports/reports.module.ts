import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, ButtonModule, CheckboxModule, DropdownModule, FieldsetModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ReportsComponent } from './reports.component';


const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  CheckboxModule,
  FormsModule,
  DropdownModule,
  FieldsetModule,
];

const components = [
  ReportsComponent
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
export class ReportsModule { }
