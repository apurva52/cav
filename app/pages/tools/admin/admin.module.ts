import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { NetDiagnosticsEnterpriseComponent } from './net-diagnostics-enterprise/net-diagnostics-enterprise.component';
import { CardModule, TabMenuModule, TabViewModule, ToolbarModule } from 'primeng';
import { NetDiagnosticsEnterpriseModule } from './net-diagnostics-enterprise/net-diagnostics-enterprise.module';
import { ManageControllerComponent } from './manage-controller/manage-controller.component';
import { MachineConfigurationComponent } from './machine-configuration/machine-configuration.component';


const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'net-diagnostics-enterprise',
        loadChildren: () =>
          import('./net-diagnostics-enterprise/net-diagnostics-enterprise.module').then(
            (m) => m.NetDiagnosticsEnterpriseModule
          ),
        component: NetDiagnosticsEnterpriseComponent,
      },
    ],
  }
];


const imports = [
  CommonModule,
  ToolbarModule,
  CardModule,
  TabViewModule,
  TabMenuModule,
  NetDiagnosticsEnterpriseModule
];

const components = [
  AdminComponent
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
export class AdminModule { }
