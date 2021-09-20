import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialReportsFilterComponent } from './special-reports-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule, ButtonModule, CheckboxModule, DropdownModule, InputTextModule, MultiSelectModule, RadioButtonModule, ToastModule } from 'primeng';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';


@NgModule({
  declarations: [SpecialReportsFilterComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    DropdownModule,
    RadioButtonModule,
    MultiSelectModule,
    InputTextModule,
    ButtonModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    CheckboxModule,
    ToastModule

  ],
  exports: [SpecialReportsFilterComponent]
})
export class SpecialReportsFilterModule { }
