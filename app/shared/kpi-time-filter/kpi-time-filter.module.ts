import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SidebarModule,
  ButtonModule,
  InputTextModule,
  TooltipModule,
  DragDropModule,
  SliderModule,
  MessageModule,
  SlideMenuModule,
  TabViewModule,
  CheckboxModule
} from 'primeng';
import { KpiTimeFilterComponent } from './kpi-time-filter.component';
import { PipeModule } from '../pipes/pipes.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  TooltipModule,
  ButtonModule,
  SliderModule,
  MessageModule,
  PipeModule,
  SidebarModule,
  InputTextModule,
  SlideMenuModule,
  TabViewModule,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  FormsModule,
  CheckboxModule
];

const declarations = [KpiTimeFilterComponent];

@NgModule({
  declarations: [declarations],
  exports: [declarations],
  imports: [imports],
})
export class KpiTimeFilterModule { }
