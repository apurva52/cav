import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFilterComponent } from './event-revenue-sidebar.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import {AccordionModule} from 'primeng/accordion';
import {CalendarModule} from 'primeng/calendar';
import {
  CardModule,
  ButtonModule,
  MessageModule,
  TooltipModule,
  InputTextModule,
  DropdownModule,
  SidebarModule,
  RadioButtonModule,
  CheckboxModule,
  
  SliderModule, InputSwitchModule
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';

import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import {DialogModule} from 'primeng/dialog';


const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  InputTextModule,
  DropdownModule,
  SidebarModule,
  DropdownModule,
  RadioButtonModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  CheckboxModule,
  SliderModule,
  InputSwitchModule,
  AccordionModule,
  DialogModule,
  CalendarModule
];

const components = [EventFilterComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class EventFilterModule {}