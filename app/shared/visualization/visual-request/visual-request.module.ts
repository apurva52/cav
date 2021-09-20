import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualRequestComponent } from './visual-request.component';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';



const imports = [
  CommonModule,
  AceEditorModule
  
];

const components = [
  VisualRequestComponent
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
export class VisualRequestModule { }
