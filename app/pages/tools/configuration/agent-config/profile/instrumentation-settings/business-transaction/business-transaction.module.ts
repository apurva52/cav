import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessTransactionComponent } from './business-transaction.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, MessageModule, TableModule, TooltipModule, ChartModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { PatternConfigurationModule } from './pattern-configuration/pattern-configuration.module';

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
  PatternConfigurationModule
  
];

const components = [BusinessTransactionComponent];

const routes: Routes = [
  {
    path: 'business-transaction',
    component: BusinessTransactionComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class BusinessTransactionModule {}
