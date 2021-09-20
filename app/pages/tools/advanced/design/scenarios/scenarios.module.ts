import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScenariosComponent } from './scenarios.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TableModule, CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, DialogModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, FieldsetModule, InputSwitchModule, InputTextareaModule, PanelModule, RadioButtonModule } from 'primeng';
import { AddTemplateModule } from 'src/app/pages/my-library/reports/template/add-template/add-template.module';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,  
  PanelModule, 
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  FieldsetModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,
  MessageModule,
];

const components = [ScenariosComponent];


const routes: Routes = [
{
  path: 'scenarios',
  component: ScenariosComponent,
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
export class ScenariosModule { }



