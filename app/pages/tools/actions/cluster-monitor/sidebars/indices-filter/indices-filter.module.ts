import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesFilterComponent } from './indices-filter.component';
import { FormsModule } from '@angular/forms';
import {
  SidebarModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,
} from 'primeng';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';

const imports = [
  CommonModule,
  SidebarModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
];

const declarations = [IndicesFilterComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class IndicesFilterModule {}
