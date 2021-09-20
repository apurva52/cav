import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryFilterComponent } from './query-filter.component';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import {
  SidebarModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,PanelModule, CheckboxModule
} from 'primeng';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';

const imports = [
  CommonModule,
  SidebarModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  PanelModule,
  CheckboxModule
];

const declarations = [QueryFilterComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class QueryFilterModule {}
