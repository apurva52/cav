import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, CardModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, PanelModule, TabMenuModule } from 'primeng';
import { SQLActivityComponent } from './sql-activity.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { DBQueryStatsComponent } from './db-query-stats/db-query-stats.component';
import { DBQueryStatsModule } from './db-query-stats/db-query-stats.module';
import { BlockingSessionModule } from './blocking-session/blocking-session.module';
import { BlockingSessionComponent } from './blocking-session/blocking-session.component';
import { LocksComponent } from './locks/locks.component';
import { LocksModule } from './locks/locks.module';
import { SqlSessionsModule } from './sql-sessions/sql-sessions.module';
import { SqlSessionsComponent } from './sql-sessions/sql-sessions.component';
import { IoFileModule } from './io-file/io-file.module';
import { SummaryModule } from './summary/summary.module';
import { DeadlocksModule } from './deadlocks/deadlocks.module';
import { IoFileComponent } from './io-file/io-file.component';
import { SummaryComponent } from './summary/summary.component';
import { DeadlocksComponent } from './deadlocks/deadlocks.component';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  ChartModule,
  PanelModule,
  TabMenuModule,
  DBQueryStatsModule,
  BlockingSessionModule,
  LocksModule,
  SqlSessionsModule,
  IoFileModule,
  SummaryModule,
  DeadlocksModule
];
const components = [SQLActivityComponent];

const routes: Routes = [
  {
    path: 'sql-activity',
    component: SQLActivityComponent,
    children: [
      {
        path: '',
        redirectTo: 'db-query-stats',
        pathMatch: 'full',
      },
      {
        path: 'db-query-stats',
        loadChildren: () =>
          import('./db-query-stats/db-query-stats.module').then(
            (m) => m.DBQueryStatsModule
          ),
        component: DBQueryStatsComponent
      },
      {
        path: 'blocking-session',
        loadChildren: () =>
          import('./blocking-session/blocking-session.module').then(
            (m) => m.BlockingSessionModule
          ),
        component: BlockingSessionComponent
      },
      {
        path: 'locks',
        loadChildren: () =>
          import('./locks/locks.module').then(
            (m) => m.LocksModule
          ),
        component: LocksComponent
      },
      {
        path: 'sessions',
        loadChildren: () =>
          import('./sql-sessions/sql-sessions.module').then(
            (m) => m.SqlSessionsModule
          ),
        component: SqlSessionsComponent
      },
      {
        path: 'io-file',
        loadChildren: () =>
          import('./io-file/io-file.module').then(
            (m) => m.IoFileModule
          ),
        component: IoFileComponent
      },
      {
        path: 'summary',
        loadChildren: () =>
          import('./summary/summary.module').then(
            (m) => m.SummaryModule
          ),
        component: SummaryComponent
      },
      {
        path: 'deadlocks',
        loadChildren: () =>
          import('./deadlocks/deadlocks.module').then(
            (m) => m.DeadlocksModule
          ),
        component: DeadlocksComponent
      },
    ]
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SQLActivityModule { }
