import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedIndicesComponent } from './selected-indices.component';
import { AccordionModule,DialogModule, BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, FieldsetModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, TabMenuModule, ToastModule, ToolbarModule, TreeModule, TreeTableModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const components = [
  SelectedIndicesComponent
];

const imports = [
  CommonModule,
  CardModule,
  DialogModule,
  TabMenuModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  MessageModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  FormsModule,
  ButtonModule,
  AccordionModule,
  CheckboxModule,
  TreeModule,
  TreeTableModule,
  ToolbarModule,
  HeaderModule,
  MultiSelectModule,
  PanelModule,
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FieldsetModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports:[components]
})
export class SelectedIndicesModule { }
