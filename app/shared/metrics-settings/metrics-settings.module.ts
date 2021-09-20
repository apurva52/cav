import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule, BreadcrumbModule, ButtonModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, PanelModule, RadioButtonModule, TabMenuModule, TabViewModule, TooltipModule, ProgressSpinnerModule } from 'primeng';
import { MetricsSettingsComponent } from './metrics-settings.component';
import { FormsModule } from '@angular/forms';
import { HelpRelatedmetricsModule } from '../metrics/relatedmetrics/helprelatedmetrics/helprelatedmetrics.module';
import { ChartModule } from '../chart/chart.module';

const components = [
  MetricsSettingsComponent
];

const imports = [
  CommonModule,
  DialogModule,
  BreadcrumbModule, 
  TabMenuModule,
  PanelModule,
  TooltipModule,
  RadioButtonModule,
  DropdownModule,
  CheckboxModule,
  InputTextModule,
  TabViewModule,
  AccordionModule,
  ButtonModule,
  FormsModule,
  HelpRelatedmetricsModule,
  ProgressSpinnerModule, 
  ChartModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class MetricsSettingsModule { }
