import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureIndexPatternComponent } from './configure-index-pattern.component';
import { ButtonModule, DialogModule, InputTextModule, CheckboxModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  ButtonModule,
  FormsModule,
  DialogModule,
  InputTextModule,
  CheckboxModule,
];

const components = [
  ConfigureIndexPatternComponent
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
export class ConfigureIndexPatternModule { }
