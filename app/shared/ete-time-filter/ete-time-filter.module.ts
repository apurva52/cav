import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EteTimeFilterComponent } from './ete-time-filter.component';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {
  TooltipModule,
  ButtonModule,
  SliderModule,
  MessageModule,
  SidebarModule,
  InputTextModule,
  SlideMenuModule,
  TabViewModule,
  CheckboxModule,
} from 'primeng';
import { PipeModule } from '../pipes/pipes.module';

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
  CheckboxModule,
];

const declarations = [EteTimeFilterComponent];

@NgModule({
  declarations: [declarations],
  exports: [declarations],
  imports: [imports],
})
export class EteTimeFilterModule {}
