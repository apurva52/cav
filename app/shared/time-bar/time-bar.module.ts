import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { CheckboxModule, InputTextModule, MessageModule, SidebarModule, SlideMenuModule, SliderModule, TooltipModule } from 'primeng';
import { ButtonModule } from 'primeng/button';
import { OwlMomentDateTimeModule } from '../date-time-picker-moment/moment-date-time.module';
import { PipeModule } from '../pipes/pipes.module';
import { TimeBarComponent } from './time-bar.component';



const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TooltipModule,
  ButtonModule,
  SliderModule,
  MessageModule,
  PipeModule,
  SidebarModule,
  InputTextModule,
  SlideMenuModule,
  CheckboxModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule
];

const components = [TimeBarComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components]
})
export class TimeBarModule { }
