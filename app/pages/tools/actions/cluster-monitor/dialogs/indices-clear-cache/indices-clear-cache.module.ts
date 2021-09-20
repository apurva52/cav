import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesClearCacheComponent } from './indices-clear-cache.component';
import { DialogModule, ButtonModule } from 'primeng';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';
import { FormsModule } from '@angular/forms';

const imports = [CommonModule, DialogModule, ButtonModule, FormsModule, AceEditorModule];

const components = [IndicesClearCacheComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class IndicesClearCacheModule {}
