import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceOpenMergeComponent } from './advance-open-merge.component';
import {
  SidebarModule,
  DropdownModule,
  CheckboxModule,
  ButtonModule,
  InputTextModule,
  AccordionModule,
  RadioButtonModule,
} from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  SidebarModule,
  DropdownModule,
  CheckboxModule,
  ButtonModule,
  InputTextModule,
  AccordionModule,
  RadioButtonModule
];

const declarations = [AdvanceOpenMergeComponent];

@NgModule({
  declarations: [declarations],
  exports: [declarations],
  imports: [imports],
})
export class AdvanceOpenMergeModule {}
