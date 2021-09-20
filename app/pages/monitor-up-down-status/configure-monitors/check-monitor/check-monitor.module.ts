import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MultiSelectModule, PanelModule, ProgressSpinnerModule, TableModule, ToastModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { CheckMonitorComponent } from './check-monitor.component';
import { TierServerModule } from '../tier-server/tier-server.module';
import { ConfiguredMonitorInfoModule } from '../configured-monitor-info/configured-monitor-info.module';

const routes: Routes = [
  {
    path: 'check-monitor/:monName',
    component: CheckMonitorComponent
  }
];

@NgModule({
  declarations: [CheckMonitorComponent],
  imports: [
    CommonModule,
    HeaderModule,
    ToolbarModule,
    DropdownModule,
    InputTextModule,
    PipeModule,
    ButtonModule,
    FormsModule,
    BreadcrumbModule,
    CheckboxModule,
    TableModule,
    DialogModule,
    ProgressSpinnerModule,
    ToastModule,
    MultiSelectModule,
    TierServerModule,
    ConfiguredMonitorInfoModule,
    PanelModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CheckMonitorModule { }
