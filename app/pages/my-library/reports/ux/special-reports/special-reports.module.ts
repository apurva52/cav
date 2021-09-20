import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpecialReportsComponent } from './special-reports.component';
import { ButtonModule, CardModule, InputTextModule, MenuModule, MultiSelectModule, ProgressSpinnerModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumberRightAlignModule } from 'src/app/shared/directives/number-right-align/number-right-align.module';



@NgModule({
  declarations: [SpecialReportsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    MenuModule,
    MultiSelectModule,
    InputTextModule,
    TooltipModule,
    ProgressSpinnerModule,
    NumberRightAlignModule
  ],
  exports: [SpecialReportsComponent]
})
export class SpecialReportsModule { }
