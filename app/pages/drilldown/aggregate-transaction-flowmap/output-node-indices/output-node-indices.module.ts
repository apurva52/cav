import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputNodeIndicesComponent } from './output-node-indices.component';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ButtonModule, DialogModule, MenuModule, OverlayPanel, OverlayPanelModule, TooltipModule } from 'primeng';
import { FlowpathDetailsModule } from '../flowpath-details/flowpath-details.module';



@NgModule({
  declarations: [OutputNodeIndicesComponent],
  imports: [
    CommonModule,
    PipeModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    OverlayPanelModule,
    FlowpathDetailsModule,
    DialogModule
  ]
})
export class OutputNodeIndicesModule { }
