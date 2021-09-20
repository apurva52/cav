import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardsComponent } from './dashboards.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {
  InputTextModule,
  ButtonModule,
  TooltipModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  BreadcrumbModule,
  MultiSelectModule,
  MenuModule,
  TreeTableModule,
  ConfirmDialogModule,
  ToastModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AddDashboardModule } from './dialogs/add-dashboard/add-dashboard.module';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { InformativeDialogModule } from 'src/app/shared/dialogs/informative-dialog/informative-dialog.module';
import { DashboardOperationsPipe } from './service/dashboard-operations.pipe';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { DashboardsDynamicTitlePipe } from './service/dashboards-dynamic-title.pipe';
import { DashboardsDeleteTitle } from './service/dashboards-delete-tooltip.pipe';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  BreadcrumbModule,
  AddDashboardModule,
  MultiSelectModule,
  FormsModule,
  InputTextModule,
  MenuModule,
  TooltipModule,
  ConfirmationDialogModule,
  InformativeDialogModule,
  TreeTableModule,
  ConfirmDialogModule,
  ToastModule,
  PipeModule
];

const components = [DashboardsComponent];

const routes: Routes = [
  {
    path: 'dashboards',
    component: DashboardsComponent,
  },
];

@NgModule({
  declarations: [components, DashboardOperationsPipe, DashboardsDynamicTitlePipe,DashboardsDeleteTitle],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsModule { }
