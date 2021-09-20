import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, AccordionModule, InputTextareaModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { MachineConfigurationComponent } from './machine-configuration.component';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,  
  AccordionModule, 
  InputTextareaModule  
];


const components = [
  MachineConfigurationComponent
];

const routes: Routes = [
  {
    path: 'machine-configuration',
    component: MachineConfigurationComponent,
  },
];


@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MachineConfigurationModule { }
