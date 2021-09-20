import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthCheckMonitorComponent } from './health-check-monitor.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {
  AccordionModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DropdownModule,
  FieldsetModule, InputTextModule, PanelModule, ProgressSpinnerModule, TableModule,
  TabViewModule, ToolbarModule, DialogModule
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { TierServerModule } from '../tier-server/tier-server.module';
import { ConfiguredMonitorInfoModule } from '../configured-monitor-info/configured-monitor-info.module';

const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  PanelModule,
  DropdownModule,
  ButtonModule,
  FormsModule,
  TabViewModule,
  FieldsetModule,
  AccordionModule,
  TableModule,
  DialogModule,
  InputTextModule,
  ConfirmDialogModule,
  CheckboxModule,
  ProgressSpinnerModule,
  TreeTableModule,
  TierServerModule,
  ConfiguredMonitorInfoModule

]

const components = [
  HealthCheckMonitorComponent
];

const routes: Routes = [
  {
    path: 'health-check-monitor',
    component: HealthCheckMonitorComponent

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
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HealthCheckMonitorModule { }
