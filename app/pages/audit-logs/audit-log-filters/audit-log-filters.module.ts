import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule, ButtonModule, CalendarModule, CheckboxModule, DropdownModule, InputTextModule, ListboxModule, MultiSelectModule, SidebarModule, SlideMenuModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { AuditLogFiltersComponent } from './audit-log-filters.component';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';


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
  ListboxModule,
  PipeModule,
  CalendarModule,
];

const components = [
  AuditLogFiltersComponent
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


export class AuditLogFiltersModule { }
