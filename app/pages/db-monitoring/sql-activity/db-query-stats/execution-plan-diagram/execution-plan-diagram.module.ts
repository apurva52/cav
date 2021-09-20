import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecutionPlanDiagramComponent } from './execution-plan-diagram.component';
import { Routes, RouterModule } from '@angular/router';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { DbClusterModule } from './db-cluster/db-cluster.module';
import { DbClusterNodeModule } from './db-cluster-node/db-cluster-node.module';
import { DbNodeIndicesModule } from './db-node-indices/db-node-indices.module';
import { SliderModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog'


const routes: Routes = [
  {
    path: 'execution-plan-diagram',
    component: ExecutionPlanDiagramComponent,
  },
];

const imports = [
  CommonModule,   
  jsPlumbToolkitModule,
  DbClusterModule,
  DbClusterNodeModule,
  DbNodeIndicesModule,
  SliderModule,
  MatDialogModule,
  FormsModule
];

const components = [ExecutionPlanDiagramComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class ExecutionPlanDiagramModule { }
