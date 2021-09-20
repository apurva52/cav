import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterJacketComponent } from './filter-jacket.component';

import {
  ButtonModule,
  DropdownModule,
  AccordionModule,
  MenuModule,
  ChipsModule,
} from 'primeng';
import { FormsModule } from '@angular/forms';


const imports = [
  CommonModule,
  DropdownModule,
  AccordionModule,
  MenuModule,
  ChipsModule,
  ButtonModule,
  FormsModule
];

const components = [
  FilterJacketComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports:[
    components
  ]
})
export class FilterJacketModule { }
