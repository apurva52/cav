import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualResponseComponent } from './visual-response.component';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';



const imports = [
  CommonModule,
  AceEditorModule
];

const components = [
  VisualResponseComponent
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

export class VisualResponseModule { }
