import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeDiagnosticsComponent } from './node-diagnostics.component';
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
import { NodeEditSettingsModule } from '../dialogs/node-edit-settings/node-edit-settings.module';

const routes: Routes = [
  {
    path: 'node-diagnostics',
    component: NodeDiagnosticsComponent,
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
  NodeEditSettingsModule
];

const components = [NodeDiagnosticsComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class NodeDiagnosticsModule {}
