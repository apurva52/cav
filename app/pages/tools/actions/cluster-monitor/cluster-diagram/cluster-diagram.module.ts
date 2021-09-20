import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusterDiagramComponent } from './cluster-diagram.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {
  BreadcrumbModule,
  ButtonModule,
  CheckboxModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  PanelModule,
  TableModule,
  ToolbarModule,
  TooltipModule,
} from 'primeng';
import { Routes, RouterModule } from '@angular/router';
import { NodeEditSettingsModule } from '../dialogs/node-edit-settings/node-edit-settings.module';
import { NodeDiagnosticsModule } from '../node-diagnostics/node-diagnostics.module';
import { NodeInformationModule } from '../node-information/node-information.module';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { OutputNodeIndicesModule } from './output-node-indices/output-node-indices.module';
import { ClusterModule } from './cluster/cluster.module';
import { ClusterNodeModule } from './cluster-node/cluster-node.module';

const routes: Routes = [
  {
    path: 'cluster-diagram',
    component: ClusterDiagramComponent,
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
  TooltipModule,
  TableModule,
  DialogModule,
  NodeDiagnosticsModule,
  NodeInformationModule,
  NodeEditSettingsModule,
  CheckboxModule,
  jsPlumbToolkitModule,
  OutputNodeIndicesModule,
  ClusterNodeModule,
  ClusterModule
];

const components = [ClusterDiagramComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class ClusterDiagramModule {}
