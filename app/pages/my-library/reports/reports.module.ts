import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { TemplateComponent } from './template/template.component';
import { RouterModule, Routes } from '@angular/router';
import { TemplateModule } from './template/template.module';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule,TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { MetricsComponent } from './metrics/metrics.component';
import { DetailedComponent } from './detailed/detailed.component';
import { ReadyComponent } from './ready/ready.component';
//import { VisualizationComponent } from './visualization/visualization.component';
import { RecentReportsComponent } from './recent-reports/recent-reports.component';
import { MetricsModule } from './metrics/metrics.module';
import { ReadyModule } from './ready/ready.module';
import { DetailedModule } from './detailed/detailed.module';
//import { VisualizationModule } from './visualization/visualization.module';
import { RecentReportsModule } from './recent-reports/recent-reports.module';

import { IndicesModule } from './indices/indices.module';
import { IndicesComponent } from './indices/indices.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SchedulesModule } from './schedules/schedules.module';
import { AddReportModule } from './metrics/add-report/add-report.module';
import { AddReportSettingsModule } from './metrics/add-report-settings/add-report-settings.module';
import { AddReportComponent } from './metrics/add-report/add-report.component';
import { AddReportSettingsComponent } from './metrics/add-report-settings/add-report-settings.component';
import { UxComponent } from './ux/ux.component';
import { UxModule } from './ux/ux.module';
import { AddCustomUxReportComponent } from './metrics/add-custom-ux-report/add-custom-ux-report.component';
import { AddCustomUxReportModule } from './metrics/add-custom-ux-report/add-custom-ux-report.module';
import { LogsVisualizationComponent } from './logs-visualization/logs-visualization.component';
import { LogsVisualizationModule } from './logs-visualization/logs-visualization.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog'; 

const imports = [
  CommonModule,
  TemplateModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  MetricsModule,
  DetailedModule,
  ReadyModule,
  //VisualizationModule,
  RecentReportsModule,
  TemplateModule,
  SchedulesModule,
  AddReportModule,
  AddReportSettingsModule,
  IndicesModule,
  UxModule,
  AddCustomUxReportModule,
  LogsVisualizationModule,
  ConfirmDialogModule,
  DialogModule,
  TooltipModule
];

const components = [
  ReportsComponent
]; 

const routes: Routes = [
  {
    path: 'reports',
    component: ReportsComponent,
    children: [
      {
        path: '',
        redirectTo: 'metrics',
        pathMatch: 'full',
      },
      {
        path: 'metrics',
        loadChildren: () => import('./metrics/metrics.module').then(m => m.MetricsModule),
        component: MetricsComponent
      },
      {
        path: 'detailed',
        loadChildren: () => import('./detailed/detailed.module').then(m => m.DetailedModule),
        component: DetailedComponent
      },
      {
        path: 'ready',
        loadChildren: () => import('./ready/ready.module').then(m => m.ReadyModule),
        component: ReadyComponent
      },
      // {
      //   path: 'visualization',
      //   loadChildren: () => import('./visualization/visualization.module').then(m => m.VisualizationModule),
      //   component: VisualizationComponent
      // },
      {
        path: 'logs-visualization',
        loadChildren: () => import('./logs-visualization/logs-visualization.module').then(m => m.LogsVisualizationModule),
        component: LogsVisualizationComponent
      },
      {
        path: 'recent-reports',
        loadChildren: () => import('./recent-reports/recent-reports.module').then(m => m.RecentReportsModule),
        component: RecentReportsComponent
      },
      {
        path: 'template',
        loadChildren: () => import('./template/template.module').then(m => m.TemplateModule),
        component: TemplateComponent
      },
      {
        path: 'schedules',
        loadChildren: () => import('./schedules/schedules.module').then(m => m.SchedulesModule),
        component: SchedulesComponent
      },
      {
        path: 'add-report',
        loadChildren: () => import('./metrics/add-report/add-report.module').then(m => m.AddReportModule),
        component: AddReportComponent
      },
      {
        path: 'add-report-setting',
        loadChildren: () => import('./metrics/add-report-settings/add-report-settings.module').then(m => m.AddReportSettingsModule),
        component: AddReportSettingsComponent
      },
      {
        path: 'select-indices',
        loadChildren: () => import('./indices/indices.module').then(m => m.IndicesModule),
        component: IndicesComponent
      },
      {
        path: 'ux',
        loadChildren: () => import('./ux/ux.module').then(m => m.UxModule),
        component: UxComponent
      },
      {
        path: 'add-custom-ux-report',
        loadChildren: () => import('./metrics/add-custom-ux-report/add-custom-ux-report.module').then(m => m.AddCustomUxReportModule),
        component: AddCustomUxReportComponent
      },
    ]
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


export class ReportsModule { }
