import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '../loader/loader.module';
import { OrderListModule, MessageModule, DropdownModule, FieldsetModule, CalendarModule, RadioButtonModule, TableModule, InputTextModule, CardModule, ButtonModule, ToolbarModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageBaselineSettingsComponent } from './page-baseline-settings.component'
import { HeaderModule } from 'src/app/shared/header/header.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
const imports = [
  CommonModule,
  OrderListModule,
  MessageModule,
  TableModule,
  InputTextModule,
  LoaderModule,
  DropdownModule,
  RadioButtonModule,
  CardModule,
  CommonModule,
  FieldsetModule,
  TableModule,
  CalendarModule,
  CardModule,
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
  OwlDateTimeModule



];
const components = [
  PageBaselineSettingsComponent
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
export class PageBaselineSettingsModule { }

