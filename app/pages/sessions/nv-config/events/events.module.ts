import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule, CardModule, ButtonModule, ConfirmDialogModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, DialogModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { DeleteEntryModule } from '../dialog/delete-entry/delete-entry.module';
import { EventsCrudModule } from '../dialog/events-crud/events-crud.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  ConfirmDialogModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  ReactiveFormsModule,
  LongValueModule,
  DialogModule,
  PipeModule,
  SlideMenuModule,
  MenuModule,
  IpSummaryOpenBoxModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule,
  DeleteEntryModule,
  EventsCrudModule
];

const components = [
  EventsComponent
];
const routes: Routes = [
  {
    path: 'events',
    component: EventsComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule, components
  ]
})
export class EventsModule { }

