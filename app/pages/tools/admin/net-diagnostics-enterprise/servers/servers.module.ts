import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServersComponent } from './servers.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, CheckboxModule, DialogModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, SlideMenuModule, TableModule, ToastModule, ToolbarModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteEntryModule } from 'src/app/pages/sessions/nv-config/dialog/delete-entry/delete-entry.module';
import { UpgradeCmonModule } from '../dialogs/upgrade-cmon/upgrade-cmon.module';
import { RunningMonitorsModule } from '../dialogs/running-monitors/running-monitors.module';
import { RunCommandModule } from '../dialogs/run-command/run-command.module';
import { StartNcmonModule } from '../dialogs/start-ncmon/start-ncmon.module';
import { AddServerModule } from './add-server/add-server.module';
import { CmonVersionModule } from '../dialogs/cmon-version/cmon-version.module';
import { ShowCmonModule } from '../dialogs/show-cmon/show-cmon.module';
import { CmonStatsModule } from '../dialogs/cmon-stats/cmon-stats.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  ReactiveFormsModule,
  DialogModule,
  SlideMenuModule,
  MenuModule,
  InputTextModule,
  DeleteEntryModule,
  UpgradeCmonModule,
  RunningMonitorsModule,
  RunCommandModule,
  StartNcmonModule,
  AddServerModule,
  CmonVersionModule,
  ShowCmonModule,
  AddServerModule,
  CmonStatsModule
];

const components = [
  ServersComponent
];
const routes: Routes = [
  {
    path: 'servers',
    component: ServersComponent,
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
})
export class ServersModule { }
