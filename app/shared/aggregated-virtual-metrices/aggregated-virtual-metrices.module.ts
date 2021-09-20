import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedVirtualMetricesComponent } from './aggregated-virtual-metrices.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, InputTextModule, ChartModule, DropdownModule, InputTextareaModule, MultiSelectModule, PanelModule, RadioButtonModule } from 'primeng';
import { DerivedMetricIndicesModule } from '../derived-metric/derived-metric-indices/derived-metric-indices.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';

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
  ConfirmDialogModule
];

const components = [AggregatedVirtualMetricesComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class AggregatedVirtualMetricesModule { }
