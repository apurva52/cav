import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowpathDetailsComponent } from './flowpath-details.component';
import { ButtonModule, CardModule, DialogModule, InputTextareaModule, MenuModule, MessageModule, MultiSelectModule, SlideMenuModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { DiagnosticsConfigurationModule } from 'src/app/shared/diagnostics-configuration/diagnostics-configuration.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  FormsModule,
  MenuModule,
  MultiSelectModule,
  MessageModule,
  ButtonModule,
  SlideMenuModule,
  DiagnosticsConfigurationModule,
  DialogModule,
  TooltipModule,
  InputTextareaModule
];

const components = [
  FlowpathDetailsComponent
]

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})

export class FlowpathDetailsModule { }
