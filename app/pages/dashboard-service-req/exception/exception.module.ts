import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ExceptionComponent } from './exception.component';
import { PanelModule, TooltipModule, TableModule, MenuModule, ButtonModule, MessageModule, InputTextModule, MultiSelectModule, CardModule } from 'primeng';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import {TabViewModule} from 'primeng/tabview';

const imports = [
  CommonModule,
  PanelModule,
  TooltipModule,
  TableModule,
  MenuModule,
  FormsModule,
  ButtonModule,
  MessageModule,
  InputTextModule,
  AceEditorModule,
  PipeModule,
  MultiSelectModule,
  CardModule,
  AccordionModule,
  TabViewModule
];

const components = [
  ExceptionComponent
];

const routes: Routes = [
  {
    path: 'exception',
    component: ExceptionComponent
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
  ]
})
export class ExceptionModule { }
