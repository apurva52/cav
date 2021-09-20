import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule, ButtonModule, CheckboxModule, DropdownModule, InputTextModule, ListboxModule, MultiSelectModule, SidebarModule, SlideMenuModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { SchedulesFiltersComponent } from './schedules-filters.component';


const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  AccordionModule,
  InputTextModule,
  ButtonModule,
  SidebarModule,
  SlideMenuModule,
  CheckboxModule,
  MultiSelectModule,
  ListboxModule
];

const components = [
  SchedulesFiltersComponent
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


export class SchedulesFiltersModule { }
