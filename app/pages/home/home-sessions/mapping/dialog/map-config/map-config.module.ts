import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapConfigComponent } from './map-config.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, OrderListModule, CardModule, InputTextareaModule, TabViewModule, RadioButtonModule, MessageModule, InputSwitchModule, SliderModule } from 'primeng';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { RouterModule, Routes } from '@angular/router';

const components = [
  MapConfigComponent
];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule,
  InputTextareaModule,
  TabViewModule,
  RadioButtonModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MessageModule,
  InputSwitchModule,
  SliderModule
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
export class MapConfigModule { }

