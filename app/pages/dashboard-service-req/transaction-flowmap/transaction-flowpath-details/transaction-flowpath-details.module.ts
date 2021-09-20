import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, DialogModule, MenuModule, MessageModule, MultiSelectModule, SlideMenuModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { DiagnosticsConfigurationModule } from 'src/app/shared/diagnostics-configuration/diagnostics-configuration.module';
import { TransactionFlowpathDetailsComponent } from './transaction-flowpath-details.component';
import { TransactionFlowMapServiceInterceptor } from '../service/transaction-flowmap.service.interceptor';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MethodCallDetailsModule } from '../../method-call-details/method-call-details.module';
import { MethodTimingModule } from '../../method-timing/method-timing.module';
import { HotspotModule } from '../../hotspot/hotspot.module';
import { DbQueriesModule } from '../../db-queries/db-queries.module';

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
  PipeModule,
  ClipboardModule,
  MethodCallDetailsModule,
  MethodTimingModule,
  HotspotModule,
  DbQueriesModule
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
  ],
  providers: [TransactionFlowMapServiceInterceptor]
})

export class TransactionFlowpathDetailsModule { }
