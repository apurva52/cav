import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule, AccordionModule, InputTextModule, ButtonModule, SidebarModule, SlideMenuModule, CheckboxModule, MultiSelectModule, TabViewModule, CardModule, PanelModule, InputTextareaModule, ColorPickerModule } from 'primeng';
import { IntegrationComponent } from './integration.component';


const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  AccordionModule,
  InputTextModule,
  ButtonModule,
  CheckboxModule,
  TabViewModule,
  CardModule,
  PanelModule,
  InputTextareaModule,
  ColorPickerModule
];

const components = [
  IntegrationComponent
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
export class IntegrationModule { }
