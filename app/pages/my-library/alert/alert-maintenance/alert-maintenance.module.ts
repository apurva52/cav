import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertMaintenanceComponent } from './alert-maintenance.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule, ButtonModule, MessageModule, DialogModule,
  ToolbarModule, CardModule, DropdownModule, CheckboxModule, RadioButtonModule, TableModule,
   MultiSelectModule, MenuModule, BreadcrumbModule, TooltipModule, ConfirmDialogModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ConfigureMaintenanceModule } from './configure-maintenance/configure-maintenance.module';
import { ScheduleType } from 'src/app/shared/pipes/dateTime/alert/scheduleType.pipe';
import { Schedule } from 'src/app/shared/pipes/dateTime/alert/schedule.pipe';
import { UpcomingWindow } from 'src/app/shared/pipes/dateTime/alert/upcomingWindow.pipe';
import { SelectedIndicesModule } from './dialog/selected-indices/selected-indices.module';
import { GenericImportExportModule } from 'src/app/shared/generic-import-export/generic-import-export.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { AdvancedConfigurationModule } from '../alert-configuration/advanced-configuration/advanced-configuration.module';


const imports = [
  CommonModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  GenericImportExportModule,
  BreadcrumbModule,
  TooltipModule,
  RadioButtonModule,
  HeaderModule,
  ConfirmationDialogModule,
  ConfigureMaintenanceModule,
  SelectedIndicesModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  ConfirmDialogModule,
  AdvancedConfigurationModule,
]

const components = [AlertMaintenanceComponent];

const routes: Routes = [
  {
    path: 'alert-maintenance',
    component: AlertMaintenanceComponent,
  },
];

@NgModule({
  declarations: [components, ScheduleType, Schedule, UpcomingWindow],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertMaintenanceModule { }
