import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusterMonitorComponent } from './cluster-monitor.component';
import { RouterModule, Routes } from '@angular/router';
import {
  DropdownModule,
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  PanelModule,
  InputTextModule,
  TooltipModule,
  TableModule,
  DialogModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { NodeDiagnosticsComponent } from './node-diagnostics/node-diagnostics.component';
import { NodeDiagnosticsModule } from './node-diagnostics/node-diagnostics.module';
import { NodeInformationComponent } from './node-information/node-information.component';
import { NodeInformationModule } from './node-information/node-information.module';
import { NodeEditSettingsModule } from './dialogs/node-edit-settings/node-edit-settings.module';
import { ClusterDiagramComponent } from './cluster-diagram/cluster-diagram.component';
import { ClusterDiagramModule } from './cluster-diagram/cluster-diagram.module';
import { ClusterNodeInfoComponent } from './cluster-node-info/cluster-node-info.component';
import { ClusterNodeInfoModule } from './cluster-node-info/cluster-node-info.module';

const routes: Routes = [
  {
    path: 'cluster-monitor',
    component: ClusterMonitorComponent,
    children: [
      {
        path: 'cluster-diagram',
        loadChildren: () =>
          import('./cluster-diagram/cluster-diagram.module').then(
            (m) => m.ClusterDiagramModule
          ),
        component: ClusterDiagramComponent,
      },
      {
        path: 'node-diagnostics',
        loadChildren: () =>
          import('./node-diagnostics/node-diagnostics.module').then(
            (m) => m.NodeDiagnosticsModule
          ),
        component: NodeDiagnosticsComponent,
      },
      {
        path: 'node-info',
        loadChildren: () =>
          import('./node-information/node-information.module').then(
            (m) => m.NodeInformationModule
          ),
        component: NodeInformationComponent,
      },
      {
        path: 'cluster-node-info',
        loadChildren: () =>
          import('./cluster-node-info/cluster-node-info.module').then(
            (m) => m.ClusterNodeInfoModule
          ),
        component: ClusterNodeInfoComponent,
      },
    ],
  },
];

const imports = [
  CommonModule,
  HeaderModule,
  DropdownModule,
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  PanelModule,
  InputTextModule,
  ChartModule,
  TooltipModule,
  TableModule,
  DialogModule,
  NodeDiagnosticsModule,
  NodeInformationModule,
  NodeEditSettingsModule,
  ClusterDiagramModule,
  ClusterNodeInfoModule
];

const components = [ClusterMonitorComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class ClusterMonitorModule {}
