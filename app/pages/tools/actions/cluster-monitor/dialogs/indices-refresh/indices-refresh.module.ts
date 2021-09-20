import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesRefreshComponent } from './indices-refresh.component';

import { DialogModule, ButtonModule } from 'primeng';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';
import { FormsModule } from '@angular/forms';

const imports = [CommonModule, DialogModule, ButtonModule, FormsModule, AceEditorModule];

const components = [IndicesRefreshComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class IndicesRefreshModule {}
