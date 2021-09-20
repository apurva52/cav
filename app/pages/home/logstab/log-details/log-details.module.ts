import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogDetailsComponent } from './log-details.component';
import { AutoCompleteModule, ButtonModule, CardModule, InputTextModule, MenuModule, TableModule, TabMenuModule, TooltipModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';

const imports = [
  CommonModule,
  CommonModule,
  InputTextModule,
  TooltipModule,
  AutoCompleteModule,
  ButtonModule,
  FormsModule,
  CardModule,
  TableModule,
  TabMenuModule,
  MenuModule,
  AceEditorModule
];

const components = [
  LogDetailsComponent
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

export class LogDetailsModule { }
