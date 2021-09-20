import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import {
  ButtonModule, CardModule, ConfirmDialogModule, DropdownModule, InputNumberModule, InputTextModule,
  MenuModule, MessageModule, MultiSelectModule, ProgressSpinnerModule, RadioButtonModule, SelectButtonModule,
  TableModule, TooltipModule
} from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { NumberRightAlignModule } from 'src/app/shared/directives/number-right-align/number-right-align.module';
import { GeneralReportsFilterModule } from './general-reports-filter/general-reports-filter.module';
import { GeneralReportsComponent } from './general-reports.component';


@NgModule({
  declarations: [GeneralReportsComponent],
  imports: [
    CommonModule,
    RadioButtonModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    CardModule,
    DropdownModule,
    MessageModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TooltipModule,
    GeneralReportsFilterModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    TableModule,
    ChartModule,
    SelectButtonModule,
    MenuModule,
    MultiSelectModule,
    NumberRightAlignModule
  ],
  exports: [GeneralReportsComponent]
})

export class GeneralReportsModule { }
