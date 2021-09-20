import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptedFieldBoxComponent } from './scripted-field-box.component';
import { ButtonModule, DialogModule, InputTextModule, CheckboxModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  ButtonModule,
  FormsModule,
  DialogModule,
  
];

const components = [
  ScriptedFieldBoxComponent
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
export class ScriptedFieldBoxModule { }
