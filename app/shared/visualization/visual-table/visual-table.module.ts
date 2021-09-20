import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualTableComponent } from './visual-table.component';
import { CardModule, CheckboxModule, InputTextModule, TableModule, TooltipModule } from 'primeng';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  TooltipModule,
  CheckboxModule,
  InputTextModule
];

const components = [
  VisualTableComponent
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
export class VisualTableModule { }
