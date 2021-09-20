import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCrashSummaryComponent } from './app-crash-summary.component'
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { CrashReportComponent } from './../crash-report/crash-report.component'
import {
  TableModule,
  CardModule,
  ToolbarModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  BreadcrumbModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  MenuModule,
  InputTextModule,
  AutoCompleteModule,
  PaginatorModule,
  DropdownModule,
  ToggleButtonModule
} from 'primeng';

const imports = [
  CommonModule,
  TableModule,
  ToolbarModule,
  CardModule,
  HeaderModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  BreadcrumbModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  AutoCompleteModule,
  MenuModule,
  PipeModule,
  InputTextModule,
  PaginatorModule,
  DropdownModule,
  ToggleButtonModule,
];



const components = [AppCrashSummaryComponent];

const routes: Routes = [
  {
    path: 'crash-report',
    component: CrashReportComponent
  }
];


@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AppCrashSummaryModule { }


