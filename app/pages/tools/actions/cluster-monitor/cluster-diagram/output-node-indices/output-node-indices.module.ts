import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutputNodeIndicesComponent } from './output-node-indices.component';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { TooltipModule } from 'primeng';



@NgModule({
  declarations: [OutputNodeIndicesComponent],
  imports: [
    CommonModule,
    PipeModule,
    TooltipModule
  ]
})
export class OutputNodeIndicesModule { }
