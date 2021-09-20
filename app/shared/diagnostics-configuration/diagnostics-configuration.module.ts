import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosticsConfigurationComponent } from './diagnostics-configuration.component';
import { AccordionModule, ButtonModule, DropdownModule, PanelModule, RadioButtonModule, TabViewModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  ButtonModule,
  TabViewModule,
  RadioButtonModule,
  PanelModule,
  AccordionModule
];

const components = [
  DiagnosticsConfigurationComponent
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

export class DiagnosticsConfigurationModule { }
