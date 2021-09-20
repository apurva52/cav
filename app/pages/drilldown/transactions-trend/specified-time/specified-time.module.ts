import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {

  DropdownModule, DialogModule, MessageModule, InputTextModule,ButtonModule
} from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpecifiedTimeComponent } from './specified-time.component';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';

const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  DialogModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MessageModule,
  InputTextModule,
  ButtonModule
];

const components = [
  SpecifiedTimeComponent
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
export class SpecifiedTimeModule { }
