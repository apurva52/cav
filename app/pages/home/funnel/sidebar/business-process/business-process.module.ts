import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessProcessComponent } from './business-process.component';
import { SidebarModule, ButtonModule, InputTextModule, DropdownModule, TabViewModule, RadioButtonModule, OrganizationChartModule, CalendarModule, MessageModule, ToastModule } from 'primeng';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';

@NgModule({
  declarations: [BusinessProcessComponent],
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TabViewModule,
    RadioButtonModule,
    OrganizationChartModule,
    CalendarModule,
    MessageModule,
    ToastModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    FormsModule, ReactiveFormsModule,
  ],
  exports: [BusinessProcessComponent],
})

export class BusinessProcessModule { }
