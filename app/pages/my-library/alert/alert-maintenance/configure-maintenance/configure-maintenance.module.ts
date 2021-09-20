import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureMaintenanceComponent } from './configure-maintenance.component';
import {
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  CardModule,
  DropdownModule,
  OrderListModule,
  InputTextareaModule,
  RadioButtonModule,
  TabMenuModule,
  MessageModule,
  AccordionModule,
  TreeModule,
  CalendarModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { SelectedIndicesModule } from '../dialog/selected-indices/selected-indices.module';
import { AdvancedConfigurationModule } from '../../alert-configuration/advanced-configuration/advanced-configuration.module';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';

const components = [ConfigureMaintenanceComponent];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule,
  InputTextareaModule,
  RadioButtonModule,
  CardModule,
  TabMenuModule,
  MessageModule,
  CalendarModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  AccordionModule,
  TreeModule,
  SelectedIndicesModule,
  AdvancedConfigurationModule,
  ConfirmationDialogModule
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class ConfigureMaintenanceModule {}
