import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutJacketComponent } from './workspace-layout-jacket.component';
import {
  SplitButtonModule,
  InputTextModule
} from 'primeng';


const imports = [
  CommonModule,
  SplitButtonModule,
  InputTextModule
];

const components = [
  WorkspaceLayoutJacketComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports:[
    components
  ]
})

export class WorkspaceLayoutJacketModule { }
