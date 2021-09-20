import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SqlSessionsComponent } from './sql-sessions.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, PanelModule, TreeTableModule, CardModule, } from 'primeng';
import {TabMenuModule} from 'primeng/tabmenu';
import { SessionStatModule } from '../../session-stats/session-stats.module';
import { SessionWaitStatModule } from '../../wait-statistics/session-wait-stats/session-wait-stats.module';
import { SqlSessionBlockingModule } from '../../sql-session-blocking/sql-session-blocking.module';
import { SqlSessionBatchJobModule } from '../../sql-session-batchJob/sql-session-batchJob.module';
import { SqlSessionLockModule } from '../../sql-session-locking/sql-session-locking.module';
import { SqlSessionTempDBModule } from '../../sql-session-tempDb/sql-session-temDb.module';
import {CheckboxModule} from 'primeng/checkbox';

const imports = [
  CommonModule,
  TableModule, 
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  PanelModule,
  TabMenuModule,
  SessionStatModule,
  SessionWaitStatModule,
  SqlSessionBlockingModule,
  SqlSessionBatchJobModule,
  SqlSessionLockModule,
  SqlSessionTempDBModule,
  TreeTableModule,
  CardModule,
  CheckboxModule
];
const components = [SqlSessionsComponent];
const routes: Routes = [
  {
    path: 'sessions',
    component: SqlSessionsComponent,
    
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SqlSessionsModule { }
