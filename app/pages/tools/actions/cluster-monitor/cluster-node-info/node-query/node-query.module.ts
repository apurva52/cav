import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeQueryComponent } from './node-query.component';
import { Routes, RouterModule } from '@angular/router';
import {
  TooltipModule,
  TableModule,
  InputTextModule,
  ButtonModule,
  MultiSelectModule,
  CardModule,
  MenuModule
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { QueryFilterModule } from '../../sidebars/query-filter/query-filter.module';

const routes: Routes = [
  {
    path: 'node-query',
    component: NodeQueryComponent,
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
  QueryFilterModule,
  CardModule,
  MenuModule
];

const components = [NodeQueryComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class NodeQueryModule {}
