import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexPatternComponent } from './index-pattern.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, OverlayPanelModule, SlideMenuModule, SplitButtonModule, TableModule, ToastModule, ToolbarModule, TooltipModule, TabMenuModule, TabViewModule, InputNumberModule, InputTextareaModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ConfigureIndexPatternModule } from 'src/app/shared/configure-index-pattern/configure-index-pattern.module';
import { ScriptedFieldBoxModule } from 'src/app/shared/scripted-field-box/scripted-field-box.module';
import { EditFieldsModule } from 'src/app/shared/edit-fields/edit-fields.module';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  PipeModule,
  SlideMenuModule,
  MenuModule,
  IpSummaryOpenBoxModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule,
  SplitButtonModule,
  OverlayPanelModule,
  ConfigureIndexPatternModule,
  TabMenuModule,
  TabViewModule,
  ToastModule,
  InputNumberModule,
  InputTextareaModule,
  ScriptedFieldBoxModule,
  FormsModule,
  EditFieldsModule
];

const components = [IndexPatternComponent];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})


export class IndexPatternModule { }
