import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BlockUIModule, ConfirmDialogModule, FileUploadModule, ToastModule, ProgressBarModule, AccordionModule, DialogModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { TakeHeapDumpComponent } from './take-heap-dump.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

const imports = [
  CommonModule,
  BreadcrumbModule,
  FormsModule,
  ReactiveFormsModule,
  BlockUIModule, ConfirmDialogModule, FileUploadModule, ToastModule, ProgressBarModule, AccordionModule, DialogModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule, HeaderModule,MatDialogModule];
const components = [
    TakeHeapDumpComponent
];
const routes: Routes = [
  {
    path: 'take-heap-dump',
    component: TakeHeapDumpComponent,

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
export class TakeHeapDumpModule { }





