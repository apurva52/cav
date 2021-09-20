import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralReportsFilterComponent } from './general-reports-filter.component';
import { ButtonModule, DropdownModule, InputNumberModule, InputTextModule, MessageModule, RadioButtonModule, SidebarModule } from 'primeng';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [GeneralReportsFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    ButtonModule,
    RadioButtonModule,
    DropdownModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    InputNumberModule,
    MessageModule,
    InputTextModule
  ],
  exports: [GeneralReportsFilterComponent]
})

export class GeneralReportsFilterModule { }
