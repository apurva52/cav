import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalDrilldownFilterComponent } from './global-drilldown-filter.component';
import {
  ButtonModule,
 InputTextModule,
 DropdownModule,
 AccordionModule,
 SidebarModule,
 SlideMenuModule, CheckboxModule
} from 'primeng';
import { FormsModule } from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';

const imports = [
  CommonModule,
  DropdownModule,
  MultiSelectModule,
  FormsModule,
  AccordionModule,
  InputTextModule,
  ButtonModule,
  SidebarModule,
  SlideMenuModule,
  CheckboxModule,
  CalendarModule
];

const components = [
  GlobalDrilldownFilterComponent
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
export class GlobalDrilldownFilterModule { }
