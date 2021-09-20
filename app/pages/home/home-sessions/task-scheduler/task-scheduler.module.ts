import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, DialogModule, ChipsModule, TabMenuModule, CalendarModule, CardModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule, AccordionModule, BreadcrumbModule, CarouselModule, ChartModule, CheckboxModule, DropdownModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, ToolbarModule } from 'primeng';

import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { TaskSchedulerComponent } from './task-scheduler.component'

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  TooltipModule,
  FormsModule,
  ToastModule,
  CommonModule,
  ChipsModule,
  ChartModule,
  CarouselModule,
  TabMenuModule,
  CalendarModule,
  AccordionModule,
  ToolbarModule,
  HeaderModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  PanelModule,
  ConfirmDialogModule,
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  MessageModule,
  DialogModule
];
const components = [TaskSchedulerComponent];
@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [],
})
export class TaskSchedulerModule { }

