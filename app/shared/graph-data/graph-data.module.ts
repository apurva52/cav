import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, ButtonModule, TableModule, MenuModule, CardModule, MessageModule, MultiSelectModule, TooltipModule, InputTextModule,AccordionModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphDataComponent } from './graph-data.component';

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  FormsModule,
  TableModule,
  MenuModule,
  CardModule,
  MessageModule,
  MultiSelectModule,
  TooltipModule,
  InputTextModule,
  ReactiveFormsModule,
  AccordionModule
];

const components = [
  GraphDataComponent
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
export class GraphDataModule { }
