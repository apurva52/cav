import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaskComponent } from './create-task.component';
import { FormsModule } from '@angular/forms';
import {
  DialogModule,
  DropdownModule,
  InputTextModule,
  RadioButtonModule,
  ButtonModule,
  TabViewModule, CardModule, MessageModule
} from 'primeng';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';

const imports = [
  CommonModule,
  DialogModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  RadioButtonModule,
  ButtonModule,
  TabViewModule,
  CardModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MessageModule
];

const declarations = [CreateTaskComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class CreateTaskModule {}
