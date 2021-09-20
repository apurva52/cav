import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
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
  SliderModule, InputSwitchModule, PanelModule, RatingModule, ToastModule
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { FeedbackFilterSidebarComponent } from './feedback-filter-sidebar.component'; 
import { CalendarModule } from 'primeng/calendar'; 
import { MatSnackBarModule } from '@angular/material/snack-bar'; 

const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  FormsModule, 
  RouterModule,
  ReactiveFormsModule,
  //FormGroup, 
  //FormBuilder, 
  //Validators,
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
  PanelModule,
  RatingModule,
  CalendarModule,
  MatSnackBarModule,
  ToastModule
];

const components = [FeedbackFilterSidebarComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class FeedbackFilterSidebarModule {}
