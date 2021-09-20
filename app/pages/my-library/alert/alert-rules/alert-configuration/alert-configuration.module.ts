import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertConfigurationComponent } from './alert-configuration.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MultiSelectModule, PanelModule, RadioButtonModule, ToolbarModule, KeyFilterModule, ChipsModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { AddActionModule } from '../../alert-actions/add-action/add-action.module';
import { AdvancedConfigurationModule } from '../../alert-configuration/advanced-configuration/advanced-configuration.module';
import { DerivedMetricIndicesModule } from 'src/app/shared/derived-metric/derived-metric-indices/derived-metric-indices.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  KeyFilterModule,
  RadioButtonModule,
  DropdownModule,  
  PanelModule, 
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  AddActionModule,
  AdvancedConfigurationModule,
  DerivedMetricIndicesModule,
  MultiSelectModule,
  ChipsModule,
  ChartModule,
  TooltipModule,
  PipeModule
]

const components = [AlertConfigurationComponent];

const routes: Routes = [
  {
    path: 'alert-configuration',
    component: AlertConfigurationComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertConfigurationModule { }
