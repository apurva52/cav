import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputNodeIndicesComponent } from './output-node-indices.component';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import {
  ButtonModule,
  MenuModule,
  OverlayPanel,
  OverlayPanelModule,
  TooltipModule,
} from 'primeng';
import { TransactionFlowpathDetailsModule } from '../transaction-flowpath-details/transaction-flowpath-details.module';
@NgModule({
  declarations: [OutputNodeIndicesComponent],
  imports: [
    CommonModule,
    PipeModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    OverlayPanelModule,
    TransactionFlowpathDetailsModule
  ],
})
export class OutputNodeIndicesModule {}
