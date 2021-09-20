import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFilterComponent } from './time-filter.component';
import { ToolbarModule, ButtonModule, InputTextModule, MessageModule, DialogModule, CheckboxModule, MultiSelectModule, MenuModule, TooltipModule, RadioButtonModule, DropdownModule } from 'primeng';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const imports = [
  CommonModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  ToolbarModule, ButtonModule, InputTextModule, MessageModule,
  DialogModule, CheckboxModule, MultiSelectModule,
  MenuModule, TooltipModule, RadioButtonModule, DropdownModule,
  FormsModule, 
  ReactiveFormsModule
];

@NgModule({
  declarations: [TimeFilterComponent],
  imports: [
    imports
  ],
  exports: [TimeFilterComponent]
})
export class TimeFilterModule { }
