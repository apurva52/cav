import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatternConfigurationComponent } from './pattern-configuration.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, MessageModule, TableModule, TooltipModule, ChartModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ConfigureDetectionRulesModule } from './configure-detection-rules/configure-detection-rules.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,  
  PanelModule, 
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  MessageModule,
  TableModule,
  TooltipModule,
  ChartModule,
  PipeModule,
  ConfigureDetectionRulesModule
];

const components = [PatternConfigurationComponent];

const routes: Routes = [
  {
    path: 'business-transaction',
    component: PatternConfigurationComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class PatternConfigurationModule {}
