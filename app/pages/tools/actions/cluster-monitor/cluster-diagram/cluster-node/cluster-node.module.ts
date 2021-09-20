import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusterNodeComponent } from './cluster-node.component';
import { TooltipModule } from 'primeng';



@NgModule({
  declarations: [ClusterNodeComponent],
  imports: [
    CommonModule,
    TooltipModule
  ]
})
export class ClusterNodeModule { }
