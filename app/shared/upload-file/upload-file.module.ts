import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileComponent } from './upload-file.component';
import { ButtonModule, DialogModule, InputTextModule } from 'primeng';

const imports = [
  CommonModule,
  ButtonModule,
  DialogModule,
  InputTextModule,
];

const components = [
  UploadFileComponent
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
export class UploadFileModule { }