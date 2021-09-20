import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeMappingComponent } from './node-mapping.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {
  TooltipModule,
  TableModule,
  InputTextModule,
  ButtonModule,
  MultiSelectModule, CardModule, MenuModule
} from 'primeng';

const routes: Routes = [
  {
    path: 'node-mapping',
    component: NodeMappingComponent,
  },
];

const imports = [
  CommonModule,
  TooltipModule,
  TableModule,
  InputTextModule,
  ButtonModule,
  MultiSelectModule,
  FormsModule,
  CardModule,
  MenuModule
];

const components = [NodeMappingComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class NodeMappingModule {}
