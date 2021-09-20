import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceViewerComponent } from './source-viewer.component';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule, OverlayPanelModule, ProgressBarModule, TabMenuModule } from 'primeng';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';


@NgModule({
  declarations: [SourceViewerComponent],
  imports: [
    CommonModule,
    FormsModule,
    TabMenuModule,
    ProgressBarModule,
    AceEditorModule,
    OverlayPanelModule,
    ConfirmDialogModule
  ],
  exports: [SourceViewerComponent]
})


export class SourceViewerModule { }
