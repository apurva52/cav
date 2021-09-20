import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerStatsComponent } from './server-stats.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, CardModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, TabMenuModule, InputSwitchModule } from 'primeng';
import { ConfigurationsModule } from './configurations/configurations.module';
import { ConnectionStatsModule } from './connection-stats/connection-stats.module';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { ConnectionStatsComponent } from './connection-stats/connection-stats.component';


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
  InputSwitchModule,
  TabMenuModule,
  ConfigurationsModule,
  ConnectionStatsModule
];
const components = [ServerStatsComponent];

const routes: Routes = [
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
        loadChildren: () =>
          import('./configurations/configurations.module').then(
            (m) => m.ConfigurationsModule
          ),
        component: ConfigurationsComponent
      },
      {
        path: 'connection-stats',
        loadChildren: () =>
          import('./connection-stats/connection-stats.module').then(
            (m) => m.ConnectionStatsModule
          ),
        component: ConnectionStatsComponent
      },
    ]
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServerStatsModule { }
