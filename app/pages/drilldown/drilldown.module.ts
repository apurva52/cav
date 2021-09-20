import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrilldownComponent } from './drilldown.component';
import { RouterModule, Routes } from '@angular/router';
import { FlowPathComponent } from './flow-path/flow-path.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, ButtonModule, CardModule, MenuModule, TabMenuModule, ToolbarModule } from 'primeng';
import { TransactionsGroupComponent } from './transactions-group/transactions-group.component';
import { TransactionsTrendComponent } from './transactions-trend/transactions-trend.component';
import { GlobalDrilldownFilterModule } from 'src/app/shared/global-drilldown-filter/global-drilldown-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { TransactionFlowmapComponent } from './transaction-flowmap/transaction-flowmap.component';
import { TransactionFlowmapModule } from './transaction-flowmap/transaction-flowmap.module';
import { DbGroupByModule } from "./ddr-p4/db-group-by/db-group-by.module";
import { DbGroupByComponent } from './ddr-p4/db-group-by/db-group-by.component';
import { FlowpathGroupByComponent } from './ddr-p4/flowpath-group-by/flowpath-group-by.component';

const components = [DrilldownComponent];
const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  MenuModule,
  TabMenuModule,
  ButtonModule,
  GlobalDrilldownFilterModule,
  CardModule,
  BreadcrumbModule,
  LongValueModule,
  PipeModule,
  TransactionFlowmapModule,
  DbGroupByModule
];

const routes: Routes = [
  {
    path: 'drilldown',
    // data: {
    //   breadcrumb: 'System',
    // },
    component: DrilldownComponent,
    children: [
      {
        path: '',
        redirectTo: 'flow-path',
        pathMatch: 'full',
      },
      {
        path: 'flow-path',
        data: {
          breadcrumb: 'Drill Down Flow Paths',
        },
        loadChildren: () =>
          import('./flow-path/flow-path.module').then((m) => m.FlowPathModule),
        component: FlowPathComponent,
      },
      {
        path: 'transactions-group',
        data: {
          breadcrumb: 'Drill Down Transactions Group'
        },
        loadChildren: () =>
          import('./transactions-group/transactions-group.module').then((m) => m.TransactionsGroupModule),
        component: TransactionsGroupComponent,
      },
      {
        path: 'transactions-trend',
        data: {
          breadcrumb: 'Drill Down Transaction Trends'
        },
        loadChildren: () =>
          import('./transactions-trend/transactions-trend.module').then((m) => m.TransactionsTrendModule),
        component: TransactionsTrendComponent,
      },
      {
        path: 'transaction-flowpath',
        loadChildren: () =>
          import('./transaction-flowmap/transaction-flowmap.module').then((m) => m.TransactionFlowmapModule),
        component: TransactionFlowmapComponent,
      },
      {
        path: 'flowpath-group-by',
        loadChildren: () => import('./ddr-p4/flowpath-group-by/flowpath-group-by.module').then((m) => m.FlowpathGroupByModule),
        component: FlowpathGroupByComponent
      },
      {
        path: 'db-group-by',
        loadChildren: () => import('./ddr-p4/db-group-by/db-group-by.module').then((m) => m.DbGroupByModule),
        component: DbGroupByComponent,
      },
    ],
  },
];


@NgModule({
  declarations: [components],

  imports: [RouterModule.forChild(routes), imports],
})
export class DrilldownModule { }
