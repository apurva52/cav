import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardServiceReqComponent } from './dashboard-service-req.component';
import { Routes, RouterModule } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { BusinessTransactionJacketModule } from './business-transaction-jacket/business-transaction-jacket.module';
import { MethodTimingModule } from './method-timing/method-timing.module';
import { DbQueriesModule } from './db-queries/db-queries.module';
import { ExceptionModule } from './exception/exception.module';
import { HotspotModule } from './hotspot/hotspot.module';
import { HttpReportModule } from './http-report/http-report.module';
import { IpSummaryModule } from './ip-summary/ip-summary.module';
import { MethodCallDetailsModule } from './method-call-details/method-call-details.module';
import { SequenceDiagramModule } from './sequence-diagram/sequence-diagram.module';
import { MethodCallDetailsComponent } from './method-call-details/method-call-details.component';
import { HotspotComponent } from './hotspot/hotspot.component';
import { DbQueriesComponent } from './db-queries/db-queries.component';
import { HttpReportComponent } from './http-report/http-report.component';
import { ExceptionComponent } from './exception/exception.component';
import { IpSummaryComponent } from './ip-summary/ip-summary.component';
import { SequenceDiagramComponent } from './sequence-diagram/sequence-diagram.component';
import { MethodTimingComponent } from './method-timing/method-timing.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, ToolbarModule } from 'primeng';
import { TreeTableModule } from 'primeng/treetable';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { TransactionFlowmapComponent } from './transaction-flowmap/transaction-flowmap.component';
import { TransactionFlowmapModule } from './transaction-flowmap/transaction-flowmap.module';
import { GlobalDrilldownFilterModule } from 'src/app/shared/global-drilldown-filter/global-drilldown-filter.module';

const imports = [
  CommonModule,
  TabMenuModule,
  BusinessTransactionJacketModule,
  MethodTimingModule,
  DbQueriesModule,
  ExceptionModule,
  HotspotModule,
  HttpReportModule,
  IpSummaryModule,
  MethodCallDetailsModule,
  SequenceDiagramModule,
  HeaderModule,
  ToolbarModule,
  TreeTableModule,
  BreadcrumbModule,
  LongValueModule,
  PipeModule,
  TransactionFlowmapModule,
  GlobalDrilldownFilterModule,
];

const components = [
  DashboardServiceReqComponent
];

const routes: Routes = [
  {
    path: 'dashboard-service-req',
    data: {
      breadcrumb: 'Drill Down Report (Flow Path)',
    },
    component: DashboardServiceReqComponent,
    children: [
      {
        path: '',
        redirectTo: 'method-call-details',
        pathMatch: 'full',
      },
      {
        path: 'method-call-details',
        data: {
          breadcrumb: 'Method Call Details',
        },
        loadChildren: () => import('./method-call-details/method-call-details.module').then(m => m.MethodCallDetailsModule),
        component: MethodCallDetailsComponent
      },
      {
        path: 'hotspot',
        data: {
          breadcrumb: 'Hotspot',
        },
        loadChildren: () => import('./hotspot/hotspot.module').then(m => m.HotspotModule),
        component: HotspotComponent
      },
      {
        path: 'db-queries',
        data: {
          breadcrumb: 'Db Queries',
        },
        loadChildren: () => import('./db-queries/db-queries.module').then(m => m.DbQueriesModule),
        component: DbQueriesComponent
      },
      {
        path: 'http-report',
        data: {
          breadcrumb: 'Http Report',
        },
        loadChildren: () => import('./http-report/http-report.module').then(m => m.HttpReportModule),
        component: HttpReportComponent
      },
      {
        path: 'exception',
        data: {
          breadcrumb: 'Exception',
        },
        loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule),
        component: ExceptionComponent
      },
      {
        path: 'method-timing',
        data: {
          breadcrumb: 'Method Timing',
        },
        loadChildren: () => import('./method-timing/method-timing.module').then(m => m.MethodTimingModule),
        component: MethodTimingComponent
      },
      {
        path: 'ip-summary',
        data: {
          breadcrumb: 'Ip Summary',
        },
        loadChildren: () => import('./ip-summary/ip-summary.module').then(m => m.IpSummaryModule),
        component: IpSummaryComponent
      },
      {
        path: 'sequence-diagram',
        data: {
          breadcrumb: 'Sequence Diagram',
        },
        loadChildren: () => import('./sequence-diagram/sequence-diagram.module').then(m => m.SequenceDiagramModule),
        component: SequenceDiagramComponent
      },
       {
        path: 'transaction-flowmap',
        data: {
          breadcrumb: 'Transaction Flowmap',
        },
        loadChildren: () => import('./transaction-flowmap/transaction-flowmap.module').then(m => m.TransactionFlowmapModule),
        component: TransactionFlowmapComponent
      }


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
export class DashboardServiceReqModule { }
