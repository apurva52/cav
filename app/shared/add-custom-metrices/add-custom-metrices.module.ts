import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, ButtonModule, InputTextModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { AddCustomMetricesComponent } from './add-custom-metrices.component';


const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  FormsModule,
  InputTextModule
];

const components = [
  AddCustomMetricesComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class AddCustomMetricesModule { }
