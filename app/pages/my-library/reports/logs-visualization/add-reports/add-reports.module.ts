import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddReportsComponent } from './add-reports.component';
import { RouterModule, Routes } from '@angular/router';
import { AutoCompleteModule, BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, InputTextModule, MenuModule, MessageModule, OrderListModule, ToolbarModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { FormsModule } from '@angular/forms';
import { CommonfilterModule } from 'src/app/shared/search-sidebar/commonfilter/commonfilter.module';
import { SaveDialogModule } from 'src/app/shared/save-dialog/save-dialog.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  MessageModule,
  OrderListModule,
  ButtonModule,
  CardModule,
  InputTextModule,
  TooltipModule,
  ChartModule,
  AutoCompleteModule,
  FormsModule,
  CommonfilterModule,
  SaveDialogModule,
  DialogModule,
  CheckboxModule,
  MenuModule
];
const components = [
  AddReportsComponent
];
const routes: Routes = [
  {
    path: 'add-reports',
    component: AddReportsComponent
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

export class AddReportsModule { }
