import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  InputTextModule,
  CheckboxModule,
  DropdownModule,
  FieldsetModule,
  AccordionModule,
  CalendarModule,
  SidebarModule, MessageModule, SlideMenuModule, SliderModule, TooltipModule
} from 'primeng';
import { TimePeriodComponent } from './time-period.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from '../date-time-picker-moment/moment-date-time.module';
import { PipeModule } from '../pipes/pipes.module';


const imports = [
  CommonModule,
  SidebarModule,
  ButtonModule,
  FormsModule,
  InputTextModule,
  CheckboxModule,
  FormsModule,
  PipeModule,
  DropdownModule,
  FieldsetModule,
  AccordionModule,
  CalendarModule,
  MessageModule,
  SlideMenuModule,
  ReactiveFormsModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  SliderModule,
  TooltipModule
];

const components = [
  TimePeriodComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class TimePeriodModule { }
