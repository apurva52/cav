import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SchedulereportComponent } from './schedulereport.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, ChipsModule, DropdownModule, InputTextModule, MessageModule, RadioButtonModule, TabViewModule, ToolbarModule, SlideMenuModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import {BlockUIModule} from 'primeng/blockui';

const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  CardModule,
  RadioButtonModule,
  DropdownModule,
  MessageModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  FormsModule,
  InputTextModule,
  CheckboxModule,
  ButtonModule,
  ChipsModule,
  TabViewModule,
  SlideMenuModule,
  FileUploadModule,
  CalendarModule,
  SelectButtonModule,
  ConfirmDialogModule,
  DialogModule,
  TooltipModule,
  BlockUIModule
];

const components = [
  SchedulereportComponent
];

const routes: Routes = [
  {
    path: 'schedule-report',
    component: SchedulereportComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule, components
  ]
})
export class SchedulereportModule { }
