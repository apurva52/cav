import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardJacketComponent } from './dashboard-jacket.component';
import {
  ButtonModule,
  DropdownModule,
  RadioButtonModule,
} from 'primeng';

const imports = [
  CommonModule,
  ButtonModule,
  DropdownModule,
  RadioButtonModule,
];

const components = [
  DashboardJacketComponent
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
export class DashboardJacketModule { }
