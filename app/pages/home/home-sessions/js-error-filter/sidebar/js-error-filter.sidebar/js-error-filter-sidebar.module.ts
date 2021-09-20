import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsErrorFilterSidebarComponent } from './js-error-filter-sidebar.component';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { OwlDateTimeModule ,OwlNativeDateTimeModule} from 'ng-pick-datetime';

//import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
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
  SliderModule, InputSwitchModule,
  MultiSelectModule,
  SelectButtonModule,
  TabViewModule,ToastModule
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';

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
  OwlNativeDateTimeModule,
  OwlMomentDateTimeModule,
  CheckboxModule,
  SliderModule,
  InputSwitchModule,
  CalendarModule,
  MultiSelectModule,
  SelectButtonModule,
  ReactiveFormsModule,
  TabViewModule,ToastModule
];

const components = [JsErrorFilterSidebarComponent];

/*export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};*/


@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
 

})
export class JsErrorFilterSidebarModule {}