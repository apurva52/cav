import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalFileUploadComponent } from './local-file-upload.component';
import {FileUploadModule} from 'primeng/fileupload';
import {DialogModule} from 'primeng/dialog';

const imports = [
  CommonModule,
  FileUploadModule,
  DialogModule
];

const components = [
  LocalFileUploadComponent
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
export class LocalFileUploadModule { }
