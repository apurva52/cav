import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AddTemplateComponent } from './add-template.component';
import { ToolbarModule,BreadcrumbModule, InputTextModule, PanelModule, 
  ButtonModule, CardModule, MessageModule, TableModule, OrderListModule, CheckboxModule,  
  DropdownModule, RadioButtonModule,AccordionModule, ConfirmDialogModule} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AddReportSettingsModule } from '../../metrics/add-report-settings/add-report-settings.module';
import {BlockUIModule} from 'primeng/blockui';

const imports = [

  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  InputTextModule,
  ButtonModule,
  CardModule,
  MessageModule,
  TableModule,
  OrderListModule,
  CheckboxModule,
  
  DropdownModule,
  PanelModule,
  BrowserModule,
    BrowserAnimationsModule,
		RadioButtonModule,
    FormsModule,
    PipeModule,
    AccordionModule,
    AddReportSettingsModule,
    ConfirmDialogModule,
    BlockUIModule
  
];

const components = [
  AddTemplateComponent
];

const routes: Routes = [
  {
    path: 'add-template',
    component: AddTemplateComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
})
export class AddTemplateModule { }
