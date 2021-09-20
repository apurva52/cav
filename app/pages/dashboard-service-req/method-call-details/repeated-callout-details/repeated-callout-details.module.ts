import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepeatedCalloutDetailsComponent } from './repeated-callout-details.component';
import { ButtonModule, CardModule, DialogModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { DiagnosticsConfigurationModule } from 'src/app/shared/diagnostics-configuration/diagnostics-configuration.module';
import { FlowPathDialogModule } from '../flow-path-dialog/flow-path-dialog.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
const components = [
  RepeatedCalloutDetailsComponent
];

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  MessageModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DiagnosticsConfigurationModule,
  DialogModule,
  FlowPathDialogModule,
  TooltipModule,
  InputTextModule,
  PanelModule,
  PipeModule
];

@NgModule({
  declarations: [components],
  imports: [ imports ],
  exports: [components]
})

export class RepeatedCalloutDetailsModule { }
