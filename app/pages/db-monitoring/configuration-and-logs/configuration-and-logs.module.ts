import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationAndLogsComponent } from './configuration-and-logs.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule, CardModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, PanelModule, TabMenuModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ServiceLogsComponent } from './service-logs/service-logs.component';
import { DbQueryLogsComponent } from './db-query-logs/db-query-logs.component';
import { CustomQueryComponent } from './custom-query/custom-query.component';
import { ProcedureNameComponent } from './procedure-name/procedure-name.component';
import { CustomQueryViewComponent } from './custom-query-view/custom-query-view.component';

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
  PanelModule,
  TabMenuModule,

];
const components = [ConfigurationAndLogsComponent];

const routes: Routes = [
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
        loadChildren: () =>
          import('./service-logs/service-logs.module').then(
            (m) => m.ServiceLogsModule
          ),
        component: ServiceLogsComponent
      },
      {
        path: 'db-query-logs',
        loadChildren: () =>
          import('./db-query-logs/db-query-logs.module').then(
            (m) => m.DbQueryLogsModule
          ),
        component: DbQueryLogsComponent,
      },
      {
        path: 'custom-query-view',
        loadChildren: () =>
          import('./custom-query-view/custom-query-view.module').then(
            (m) => m.CustomQueryViewModule
          ),
        component: CustomQueryViewComponent,
      }
    ]
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ConfigurationAndLogsModule { }
