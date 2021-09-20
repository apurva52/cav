import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbmHeapDumpAnalyserComponent } from './ibm-heap-dump-analyser.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BlockUIModule, ConfirmDialogModule, FileUploadModule, ToastModule, ProgressBarModule, AccordionModule, DialogModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const imports = [
  CommonModule,
  BreadcrumbModule,
  FormsModule,
  ReactiveFormsModule,
  BlockUIModule, ConfirmDialogModule, FileUploadModule, ToastModule, ProgressBarModule, AccordionModule, DialogModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule, HeaderModule];
const components = [
  IbmHeapDumpAnalyserComponent
];
const routes: Routes = [
  {
    path: 'ibm-heap-analyser-dump',
    component: IbmHeapDumpAnalyserComponent,

  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class IbmHeapDumpAnalyserModule { }





