import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCrashFilterComponent } from './app-crash-filter.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { CrashFilterSidebarModule } from './../crash-filter-sidebar/crash-filter-sidebar.module';
import { AppCrashSummaryComponent } from '../app-crash-summary/app-crash-summary.component'
import {
  TableModule,
  CardModule,
  BreadcrumbModule,
  ToolbarModule,
  ButtonModule,
  ToastModule,
  MessageModule,
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
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module'; 

import { ProgressSpinnerModule } from 'primeng/progressspinner';
const imports = [
  CommonModule,
  TableModule,
  ToolbarModule,
  CardModule,
  BreadcrumbModule,
  HeaderModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  AutoCompleteModule,
  FormsModule,
  MenuModule,
  PipeModule,
  InputTextModule,
  PaginatorModule,
  DropdownModule,
  ToggleButtonModule,
  CrashFilterSidebarModule,
  ProgressSpinnerModule
];



const components = [AppCrashFilterComponent];

const routes: Routes = [
  {
    path: 'app-crash-filter',
    component: AppCrashFilterComponent
  },
  {
    path: 'app-crash-summary',
    component: AppCrashSummaryComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AppCrashFilterModule { }


