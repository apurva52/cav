import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { ConfirmDialogModule, MessageModule, ProgressSpinnerModule } from 'primeng';
import { LayoutManagerModule } from './sidebars/layout-manager/layout-manager.module';
import { AdvanceOpenMergeModule } from './sidebars/advance-open-merge/advance-open-merge.module';
import { ShowGraphInTreeModule } from './sidebars/show-graph-in-tree/show-graph-in-tree.module';
import { WidgetSettingModule } from '../widget-setting/widget-setting.module';
import { GraphDataModule } from '../graph-data/graph-data.module';
import { PatternMatchingModule } from '../pattern-matching/pattern-matching.module';
import { AddCustomMetricesModule } from '../add-custom-metrices/add-custom-metrices.module';
import { TimePeriodModule } from '../time-period/time-period.module';
import { DashboardFavListModule } from './sidebars/dashboard-fav-list/dashboard-fav-list.module';
import { DashboardLayoutModule } from './layouts/dashboard-layout.module';
import { TimeBarModule } from '../time-bar/time-bar.module';
import { DerivedMetricModule } from '../derived-metric/derived-metric.module';
import {DerivedViewExpModule} from '../derived-view-exp/derived-view-exp.module';
import { ReportsModule } from './dialogs/reports/reports.module';
import { CustomMetricsModule } from './sidebars/custom-metrics/custom-metrics.module';
import { MetricsSettingsModule } from '../metrics-settings/metrics-settings.module';
import { GroupedDerivedMetricesModule } from '../grouped-derived-metrices/grouped-derived-metrices.module';
import { AggregatedVirtualMetricesModule } from '../aggregated-virtual-metrices/aggregated-virtual-metrices.module';
import { MetricDescriptionModule } from './dialogs/metric-description/metric-description.module';
import { RelatedmetricsModule } from '../metrics/relatedmetrics/relatedmetrics.module';
import { MonitorDialogModule } from '../monitor-dialog/monitor-dialog.module';
import { FilterParameterBoxModule } from '../filter-parameter-box/filter-parameter-box.module';
import { CopyFavoriteLinkBoxModule } from '../copy-favorite-link-box/copy-favorite-link-box.module';
import { ParametersModule } from './sidebars/parameters/parameters.module';
import { CompareDataModule } from '../compare-data/compare-data.module';
import { FileManagerModule } from '../file-manager/file-manager.module';
import { EditWidgetModule } from './sidebars/edit-widget/edit-widget.module';
import { AddDashboardModule } from 'src/app/pages/my-library/dashboards/dialogs/add-dashboard/add-dashboard.module';
import { MonitorUpDownStatusModule } from '../../pages/monitor-up-down-status/monitor-up-down-status.module';
import { CustomTemplateDialogModule } from './dialogs/custom-template-dialog/custom-template-dialog.module';
import { FilterByFavoriteModule } from './sidebars/filter-by-favorite/filter-by-favorite.module';
import { InformativeDialogModule } from '../dialogs/informative-dialog/informative-dialog.module';
import { GetFileDataModule } from '../get-file-data/get-file-data.module';
import { CatalogueManagementModule } from '../pattern-matching/catalogue-management/catalogue-management.module';
import { RunCommandModule } from 'src/app/pages/tools/admin/net-diagnostics-enterprise/dialogs/run-command/run-command.module';

const imports = [
  CommonModule,
  DashboardLayoutModule,
  CatalogueManagementModule,
  MessageModule,
  LayoutManagerModule,
  AdvanceOpenMergeModule,
  ShowGraphInTreeModule,
  WidgetSettingModule,
  GraphDataModule,
  PatternMatchingModule,
  AddCustomMetricesModule,
  TimePeriodModule,
  ReportsModule,
  DashboardFavListModule,
  TimeBarModule,
  DerivedMetricModule,
  DerivedViewExpModule,
  CustomMetricsModule,
  MetricsSettingsModule,
  GroupedDerivedMetricesModule,
  AggregatedVirtualMetricesModule,
  MetricDescriptionModule,
  RelatedmetricsModule,
  MonitorDialogModule,
  FilterParameterBoxModule,
  CopyFavoriteLinkBoxModule,
  ParametersModule,
  CompareDataModule,
  FileManagerModule,
  EditWidgetModule,
  AddDashboardModule,
  CustomTemplateDialogModule,
  FilterByFavoriteModule,
  MonitorUpDownStatusModule,
  ConfirmDialogModule,
  GetFileDataModule,
  RunCommandModule,
  ProgressSpinnerModule
];

const declarations = [DashboardComponent];

@NgModule({
  declarations: [declarations],
  exports: [declarations],
  imports: [imports],
})
export class DashboardModule {}
