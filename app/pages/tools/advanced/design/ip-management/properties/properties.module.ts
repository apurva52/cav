import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesComponent } from './properties.component';
import { ButtonModule, InputTextModule, RadioButtonModule } from 'primeng';


const components = [
  PropertiesComponent
];

const imports = [
  CommonModule,  
  ButtonModule,
  InputTextModule,
  RadioButtonModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class PropertiesModule { }
