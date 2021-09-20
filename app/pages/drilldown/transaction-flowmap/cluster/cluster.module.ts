import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusterComponent } from './cluster.component';
import { TooltipModule } from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';



@NgModule({
  declarations: [ClusterComponent],
  imports: [
    CommonModule,
    PipeModule,
    TooltipModule
  ]
})
export class ClusterModule { }
