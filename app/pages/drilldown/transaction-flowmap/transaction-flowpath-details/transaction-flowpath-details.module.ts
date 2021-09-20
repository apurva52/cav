import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, DialogModule, MenuModule, MessageModule, MultiSelectModule, SlideMenuModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { DiagnosticsConfigurationModule } from 'src/app/shared/diagnostics-configuration/diagnostics-configuration.module';
import { TransactionFlowpathDetailsComponent } from './transaction-flowpath-details.component';

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
  TooltipModule
];

const components = [
  TransactionFlowpathDetailsComponent
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

export class TransactionFlowpathDetailsModule { }
