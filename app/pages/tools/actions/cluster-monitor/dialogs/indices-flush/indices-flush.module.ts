import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesFlushComponent } from './indices-flush.component';
import { DialogModule, ButtonModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  FormsModule,
  AceEditorModule
];

const components = [IndicesFlushComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class IndicesFlushModule {}
