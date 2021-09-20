import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DerivedMetricComponent } from './derived-metric.component';
import { FormsModule } from '@angular/forms';
import {
  DropdownModule,
  InputTextModule,
  ButtonModule, DialogModule, PanelModule, InputTextareaModule, MultiSelectModule, RadioButtonModule, ProgressSpinnerModule
} from 'primeng';
import { DerivedMetricIndicesModule } from './derived-metric-indices/derived-metric-indices.module';
import { ChartModule } from '../chart/chart.module';
import { ConfirmationDialogModule } from '../dialogs/confirmation-dialog/confirmation-dialog.module';
import { InformativeDialogModule } from '../dialogs/informative-dialog/informative-dialog.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import {CustomMetricsModule} from '../dashboard/sidebars/custom-metrics/custom-metrics.module';
import {HelpModule} from './../help/help.module'
const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  PanelModule,
  InputTextareaModule,
  MultiSelectModule,
  RadioButtonModule,
  DerivedMetricIndicesModule,
  ChartModule,
  ConfirmationDialogModule,
  InformativeDialogModule,
  ConfirmDialogModule,
  CustomMetricsModule,
  ProgressSpinnerModule,
  HelpModule
];

const components = [DerivedMetricComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class DerivedMetricModule { }
