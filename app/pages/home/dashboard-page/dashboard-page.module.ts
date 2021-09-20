
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page.component';
import { Routes, RouterModule } from '@angular/router';
import {
  SidebarModule,
  ButtonModule,
  DropdownModule,
  RadioButtonModule,
  TooltipModule, SlideMenuModule, MenuModule
} from 'primeng';
import { LocalFileUploadModule } from 'src/app/shared/local-file-upload/local-file-upload.module';
import { FileManagerModule } from 'src/app/shared/file-manager/file-manager.module';
import { DashboardJacketModule } from 'src/app/shared/dashboard-jacket/dashboard-jacket.module';
import { WorkspaceLayoutJacketModule } from 'src/app/shared/workspace-layout-jacket/workspace-layout-jacket.module';
import { AddWidgetJacketModule } from 'src/app/shared/add-widget-jacket/add-widget-jacket.module';
import { DashboardModule } from 'src/app/shared/dashboard/dashboard.module';
import { LowerTabularPanelModule } from 'src/app/shared/lower-tabular-panel/lower-tabular-panel.module';
import { DerivedMetricModule } from 'src/app/shared/derived-metric/derived-metric.module';
import {DerivedViewExpModule} from 'src/app/shared/derived-view-exp/derived-view-exp.module';
import { MetricsSettingsModule } from 'src/app/shared/metrics-settings/metrics-settings.module';
import { CompareDataModule } from 'src/app/shared/compare-data/compare-data.module';
import { RelatedmetricsModule } from 'src/app/shared/metrics/relatedmetrics/relatedmetrics.module';
import { ShowGraphInTreeModule } from 'src/app/shared/dashboard/sidebars/show-graph-in-tree/show-graph-in-tree.module';
import { EditWidgetModule } from 'src/app/shared/dashboard/sidebars/edit-widget/edit-widget.module';
import { ParametersModule } from 'src/app/shared/dashboard/sidebars/parameters/parameters.module';
import { AngularResizedEventModule } from 'angular-resize-event';
import { CustomMetricsModule } from 'src/app/shared/dashboard/sidebars/custom-metrics/custom-metrics.module';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';


const imports = [
  CommonModule,
  SidebarModule,
  ButtonModule,
  DropdownModule,
  RadioButtonModule,
  LocalFileUploadModule,
  DashboardJacketModule,
  WorkspaceLayoutJacketModule,
  AddWidgetJacketModule,
  DashboardModule,
  TooltipModule,
  LowerTabularPanelModule,
  DerivedMetricModule,
  DerivedViewExpModule,
  MetricsSettingsModule,
  CompareDataModule,
  RelatedmetricsModule,
  ShowGraphInTreeModule,
  EditWidgetModule,
  ParametersModule,
  SlideMenuModule,
  FileManagerModule,
  AngularResizedEventModule,
  CustomMetricsModule,
  ConfirmationDialogModule,
  CustomMetricsModule,
  MenuModule
];

const components = [DashboardPageComponent];

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageModule {}
