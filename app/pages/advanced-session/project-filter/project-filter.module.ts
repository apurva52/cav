import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule, AccordionModule, InputTextModule, ButtonModule, SidebarModule, SlideMenuModule, CheckboxModule, MultiSelectModule } from 'primeng';
import { ProjectFilterComponent } from './project-filter.component';


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
];

const components = [
  ProjectFilterComponent
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

export class ProjectFilterModule { }
