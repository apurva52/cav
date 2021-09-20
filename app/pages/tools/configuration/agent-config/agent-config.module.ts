import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentConfigComponent } from './agent-config.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AgentConfigHomeComponent } from './agent-config-home/agent-config-home.component';
import { AgentConfigApplicationComponent } from './agent-config-application/agent-config-application.component';
import { ProfileComponent } from './profile/profile.component';
import { AgentConfigTopologyComponent } from './agent-config-topology/agent-config-topology.component';
import { ProfileMakerComponent } from './profile-maker/profile-maker.component';
import { FinderComponent } from './finder/finder.component';
import { NdeClusterConfigurationComponent } from './nde-cluster-configuration/nde-cluster-configuration.component';
import { UserConfigurationComponent } from './user-configuration/user-configuration.component';
import { DownloadAgentLogsComponent } from './download-agent-logs/download-agent-logs.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule
];


const components = [
  AgentConfigComponent
];

const routes: Routes = [
  {
    path: 'agent-config',
    component: AgentConfigComponent,
    children: [
      {
        path: '',
        redirectTo: 'agent-config-home',
        pathMatch: 'full',
      },
      {
        path: 'agent-config-home',
        loadChildren: () => import('./agent-config-home/agent-config-home.module').then(m => m.AgentConfigHomeModule),
        component: AgentConfigHomeComponent
      },
      {
        path: 'agent-config-application',
        loadChildren: () => import('./agent-config-application/agent-config-application.module').then(m => m.AgentConfigApplicationModule),
        component: AgentConfigApplicationComponent
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        component: ProfileComponent
      },
      {
        path: 'agent-config-topology',
        loadChildren: () => import('./agent-config-topology/agent-config-topology.module').then(m => m.AgentConfigTopologyModule),
        component: AgentConfigTopologyComponent
      },
      {
        path: 'profile-maker',
        loadChildren: () => import('./profile-maker/profile-maker.module').then(m => m.ProfileMakerModule),
        component: ProfileMakerComponent
      },
      {
        path: 'finder',
        loadChildren: () => import('./finder/finder.module').then(m => m.FinderModule),
        component: FinderComponent
      },
      {
        path: 'nde-cluster-config',
        loadChildren: () => import('./nde-cluster-configuration/nde-cluster-configuration.module').then(m => m.NdeClusterConfigurationModule),
        component: NdeClusterConfigurationComponent
      },
      {
        path: 'user-config',
        loadChildren: () => import('./user-configuration/user-configuration.module').then(m => m.UserConfigurationModule),
        component: UserConfigurationComponent
      },
      {
        path: 'download-agent-logs',
        loadChildren: () => import('./download-agent-logs/download-agent-logs.module').then(m => m.DownloadAgentLogsModule),
        component: DownloadAgentLogsComponent
      },
      {
        path: 'audit-logs',
        loadChildren: () => import('./audit-logs/audit-logs.module').then(m => m.AuditLogsModule),
        component: AuditLogsComponent
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
export class AgentConfigModule { }
