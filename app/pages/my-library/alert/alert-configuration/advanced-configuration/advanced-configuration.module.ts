import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, CardModule, DropdownModule, OrderListModule, InputTextareaModule, RadioButtonModule, TabMenuModule, MessageModule, AccordionModule, TreeModule, InputSwitchModule, InputNumberModule, FieldsetModule, CalendarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { AdvancedConfigurationComponent } from './advanced-configuration.component';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { MessageService } from 'primeng/api';

const components = [
  AdvancedConfigurationComponent
];

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
  AccordionModule,
  TreeModule,
  InputSwitchModule,
  InputNumberModule,
  FieldsetModule,
  CalendarModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule
];

const declarations = [AdvancedConfigurationComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
  providers: [MessageService],
})

export class AdvancedConfigurationModule { }
