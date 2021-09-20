import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddReportComponent } from './add-report.component';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule, BreadcrumbModule, ButtonModule,
CardModule, CheckboxModule, DropdownModule, InputTextModule,
MenuModule, MessageModule, MultiSelectModule, RadioButtonModule,
TableModule, ToolbarModule, TooltipModule, SlideMenuModule,
DialogModule, ConfirmDialogModule, FileUploadModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddReportSettingsModule } from '../add-report-settings/add-report-settings.module';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressBarModule} from 'primeng/progressbar';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  InputTextModule,
  ButtonModule,
  CardModule,
  MessageModule,
  CheckboxModule,
  RadioButtonModule,
  DropdownModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  FormsModule,
  AccordionModule,
  TableModule,
  MenuModule,
  TooltipModule,
  MultiSelectModule,
  AddReportSettingsModule,
  SlideMenuModule,
  DialogModule,
  ReactiveFormsModule,
  ConfirmDialogModule,
  FileUploadModule,
  BlockUIModule,
  ProgressBarModule
];
const components = [
  AddReportComponent
];
const routes: Routes = [
  {
    path: 'add-report',
    component: AddReportComponent
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
 
export class AddReportModule { }
