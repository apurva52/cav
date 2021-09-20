import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderModule } from '../loader/loader.module';
import { OrderListModule, MessageModule, DropdownModule, CalendarModule, FieldsetModule, RadioButtonModule, TableModule, InputTextModule, CardModule, ButtonModule, ToolbarModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceBaselineSettingsComponent } from './resource-baseline-settings.component'
import { HeaderModule } from 'src/app/shared/header/header.module';
const imports = [
  CommonModule,
  OrderListModule,
  MessageModule,
  TableModule,
  InputTextModule,
  LoaderModule,
  DropdownModule,
  CardModule,
  CommonModule,
  FieldsetModule,
  TableModule,
  RadioButtonModule,
  CardModule,
  CalendarModule,
  ToolbarModule,
  ButtonModule,
  ToastModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  ReactiveFormsModule,
  DialogModule,
  SlideMenuModule,
  MenuModule,
  HeaderModule,



];
const components = [
  ResourceBaselineSettingsComponent
];


@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class ResourceBaselineSettingsModule { }

