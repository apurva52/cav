import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalFileUploadModule } from '../local-file-upload/local-file-upload.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '../pipes/pipes.module';
import { SequenceDiagComponent } from './sequence-diag.component';

const imports = [
  CommonModule,
  FormsModule
];

const components = [
  SequenceDiagComponent
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
export class SequenceDiagModule { }
