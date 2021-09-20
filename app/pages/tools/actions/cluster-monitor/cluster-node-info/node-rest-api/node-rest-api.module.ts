import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeRestApiComponent } from './node-rest-api.component';
import { Routes, RouterModule } from '@angular/router';
import { ButtonModule, CardModule, PanelModule } from 'primeng';


const routes: Routes = [
  {
    path: 'node-rest-api',
    component: NodeRestApiComponent,
  },
];

const imports = [
  CommonModule,
  ButtonModule,
  PanelModule,
  CardModule

];

const components = [NodeRestApiComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class NodeRestApiModule { }
