import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpFilterSidebarComponent } from './http-filter-sidebar.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OwlDateTimeModule } from 'ng-pick-datetime';
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
  InputSwitchModule
];

const components = [HttpFilterSidebarComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class HttpFilterSidebarModule {}
