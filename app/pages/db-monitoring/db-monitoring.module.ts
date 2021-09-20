import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DBMonitoringComponent } from './db-monitoring.component';
import { RouterModule, Routes } from '@angular/router';
import { ToolbarModule, CardModule, TabViewModule, TabMenuModule, ButtonModule, InputSwitchModule, AccordionModule, SlideMenuModule, MessageModule, MenuModule, OrderListModule, SidebarModule, ToastModule, MessageService, BlockUIModule, DropdownModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { SQLActivityComponent } from './sql-activity/sql-activity.component';
import { SQLActivityModule } from './sql-activity/sql-activity.module';
import { WaitStatisticsModule } from './wait-statistics/wait-statistics.module';
import { WaitStatisticsComponent } from './wait-statistics/wait-statistics.component';
import { DatabaseModule } from './database/database.module';
import { DatabaseComponent } from './database/database.component';
import { SupportServicesModule } from './support-services/support-services.module';
import { SupportServicesComponent } from './support-services/support-services.component';
import { TempDBComponent } from './temp-db/temp-db.component';
import { TempDBModule } from './temp-db/temp-db.module';
import { ServerStatsModule } from './server-stats/server-stats.module';
import { ServerStatsComponent } from './server-stats/server-stats.component';
import { ConfigurationAndLogsModule } from './configuration-and-logs/configuration-and-logs.module';
import { ConfigurationAndLogsComponent } from './configuration-and-logs/configuration-and-logs.component';
import { FormsModule } from '@angular/forms';
import { DeadlocksComponent } from './sql-activity/deadlocks/deadlocks.component';
import { SummaryComponent } from './sql-activity/summary/summary.component';
import { IoFileComponent } from './sql-activity/io-file/io-file.component';
import { SqlSessionsComponent } from './sql-activity/sql-sessions/sql-sessions.component';
import { LocksComponent } from './sql-activity/locks/locks.component';
import { BlockingSessionComponent } from './sql-activity/blocking-session/blocking-session.component';
import { DBQueryStatsComponent } from './sql-activity/db-query-stats/db-query-stats.component';
// import { SessionWaitStatsComponent } from './wait-statistics/session-wait-stats/session-wait-stats.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { BatchJobsComponent } from './support-services/batch-jobs/batch-jobs.component';
import { SupportStatusComponent } from './support-services/support-status/support-status.component';
import { ConfigurationsComponent } from './server-stats/configurations/configurations.component';
import { ConnectionStatsComponent } from './server-stats/connection-stats/connection-stats.component';
import { ServiceLogsComponent } from './configuration-and-logs/service-logs/service-logs.component';
// import { SessionWaitStatsModule } from './wait-statistics/session-stats/session-stats.module';
import { SqlSessionsModule } from './sql-activity/sql-sessions/sql-sessions.module';
import { ExecutionPlanDetailComponent } from './sql-activity/db-query-stats/execution-plan-diagram/execution-plan-detail/execution-plan-detail.component';
// import { SessionStatComponent } from './session-stats/session-stats.component';


const routes: Routes = [
  {
    path: 'db-monitoring',
    component: DBMonitoringComponent,
    children: [
      {
        path: '',
        redirectTo: 'sql-activity',
        pathMatch: 'full',
      },
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
            component: DBQueryStatsComponent
          },
          {
            path: 'blocking-session',
            component: BlockingSessionComponent
          },
          {
            path: 'locks',
            component: LocksComponent
          },
          {
            path: 'sessions',
            component: SqlSessionsComponent
          },
          {
            path: 'io-file',
            component: IoFileComponent
          },
          {
            path: 'summary',
            component: SummaryComponent
          },
          {
            path: 'deadlocks',
            component: DeadlocksComponent
          },
        ]
      },
      {
        path: 'wait-statistics',
        component: WaitStatisticsComponent,
        // children: [
        //   {
        //     path: '',
        //     redirectTo: 'session-stats',
        //     pathMatch: 'full',
        //   },
        //   {
        //     path: 'session-stats',
        //     component: SessionStatsComponent
        //   }
        // ]
      },
      {
        path: 'database',
        loadChildren: () =>
          import('./database/database.module').then(
            (m) => m.DatabaseModule
          ),
        component: DatabaseComponent,
      },
      {
        path: '',
        redirectTo: 'support-services',
        pathMatch: 'full',
      },
      {
        path: 'support-services',
        component: SupportServicesComponent,
        children: [
          {
            path: '',
            redirectTo: 'support-status',
            pathMatch: 'full',
          },
          {
            path: 'support-status',
            component: SupportStatusComponent
          },
		      {
            path: 'batch-jobs',
            component: BatchJobsComponent
          }
        ]
      },
      {
        path: 'temp-db',
        loadChildren: () =>
          import('./temp-db/temp-db.module').then(
            (m) => m.TempDBModule
          ),
        component: TempDBComponent,
      },
      {
        path: '',
        redirectTo: 'server-stats',
        pathMatch: 'full',
      },
      {
        path: 'server-stats',
        component: ServerStatsComponent,
        children: [
          {
            path: '',
            redirectTo: 'configurations',
            pathMatch: 'full',
          },
          {
            path: 'configurations',
            component: ConfigurationsComponent
          },
		      {
            path: 'connection-stats',
            component: ConnectionStatsComponent
          }
        ]
      },
      {
        path: '',
        redirectTo: 'configuration-and-logs',
        pathMatch: 'full',
      },
      {
        path: 'configuration-and-logs',
        component: ConfigurationAndLogsComponent,
        children: [
          {
            path: '',
            redirectTo: 'service-logs',
            pathMatch: 'full',
          },
          {
            path: 'service-logs',
            component: ServiceLogsComponent
          }
        ]
      },
    ],
  }
];


const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  TabViewModule,
  TabMenuModule, 
  ButtonModule,
  FormsModule,
  InputSwitchModule,
  AccordionModule,
  SlideMenuModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MessageModule,
  MenuModule,
  OrderListModule,
  SidebarModule,
  ToastModule,
  SQLActivityModule,
  WaitStatisticsModule,
  SqlSessionsModule,
  // SessionStatsModule,
  DatabaseModule,
  SupportServicesModule,
  TempDBModule,
  ServerStatsModule,
  ConfigurationAndLogsModule,
  BlockUIModule,
  DropdownModule
];

const components = [
  DBMonitoringComponent,
  ExecutionPlanDetailComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [MessageService]
})

export class DBMonitoringModule { }
