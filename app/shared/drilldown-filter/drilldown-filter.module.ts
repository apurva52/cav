import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
   ButtonModule,
  InputTextModule,
  DropdownModule,
  AccordionModule,
  SidebarModule
} from 'primeng';
import { FormsModule} from '@angular/forms';
import { DrilldownFilterComponent } from './drilldown-filter.component';

const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  AccordionModule,
  InputTextModule,
  ButtonModule,
  SidebarModule
];

const components = [
  DrilldownFilterComponent
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
export class DrilldownFilterModule { }
