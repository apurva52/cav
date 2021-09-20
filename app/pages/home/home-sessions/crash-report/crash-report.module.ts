import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { CrashReportComponent } from './crash-report.component';

import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AppCrashModule } from './../sessions-details/app-crash/app-crash.module';
import {
  ToolbarModule, BreadcrumbModule
} from 'primeng';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  AppMessageModule,
  FormsModule,
  PipeModule,
  AppCrashModule,
];



const components = [CrashReportComponent];

const routes: Routes = [

];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [RouterModule],
})

export class CrashReportModule { }




