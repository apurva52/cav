import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddMonitorComponent } from './add-monitor.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, CheckboxModule, ChipsModule, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputSwitchModule, InputTextareaModule, MultiSelectModule, PanelModule, ProgressSpinnerModule, TableModule, ToastModule, ToolbarModule, TreeModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {RadioButtonModule} from 'primeng/radiobutton';
import { DbDeploymentComponent } from './custom-monitors/db-deployment/db-deployment.component';
import { CmdDeploymentComponent } from './custom-monitors/cmd-deployment/cmd-deployment.component';
import { JmxDeploymentComponent } from './custom-monitors/jmx-deployment/jmx-deployment.component';
import { DbAdvanceSettingsComponent } from './custom-monitors/db-advance-settings/db-advance-settings.component';
import { DynamicTableComponent } from './custom-monitors/dynamic-table/dynamic-table.component';
import { MonStatsModule } from '../mon-stats/mon-stats.module';


const routes: Routes = [
  {
    path: 'add-monitors/:techName/:techDisplayName',
    component: AddMonitorComponent
  }
];

@NgModule({
  declarations: [AddMonitorComponent, DbDeploymentComponent, CmdDeploymentComponent, JmxDeploymentComponent, DbAdvanceSettingsComponent, DynamicTableComponent],
  imports: [
    CommonModule,
    ToolbarModule,
    HeaderModule,
    ProgressSpinnerModule,
    ToastModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    AccordionModule,
    RadioButtonModule,
    DropdownModule,
    InputTextareaModule,
    TableModule,
    CardModule,
    InputTextareaModule,
    InputSwitchModule,
    TreeModule,
    PanelModule,
    ButtonModule,
    MultiSelectModule,
    ChipsModule,
    ConfirmDialogModule,
    FieldsetModule,
    DialogModule,
    MonStatsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AddMonitorModule { }
