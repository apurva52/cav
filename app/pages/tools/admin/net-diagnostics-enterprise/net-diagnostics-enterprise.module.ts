import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetDiagnosticsEnterpriseComponent } from './net-diagnostics-enterprise.component';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { ServersComponent } from './servers/servers.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AddServerComponent } from './servers/add-server/add-server.component';
import { AddServerModule } from './servers/add-server/add-server.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  AddServerModule
];


const components = [
  NetDiagnosticsEnterpriseComponent
];

const routes: Routes = [
  {
    path: 'net-diagnostics-enterprise',
    component: NetDiagnosticsEnterpriseComponent,
    children: [
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
        component: ProjectsComponent
      },
      {
        path: 'servers',
        loadChildren: () => import('./servers/servers.module').then(m => m.ServersModule),
        component: ServersComponent
      },
      {
        path: 'add-server',
        loadChildren: () => import('./servers/add-server/add-server.module').then(m => m.AddServerModule),
        component: AddServerComponent
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

export class NetDiagnosticsEnterpriseModule { }
