import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionEventComponent } from './session-event.component';
import { DropdownModule, DialogModule, ButtonModule, CardModule, CheckboxModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToastModule, ToolbarModule, TooltipModule, BreadcrumbModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { EventAggpFilterSidebarModule } from './sidebar/eventagg-filter-sidebar/eventagg-filter-sidebar.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  PipeModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  DialogModule,
  DropdownModule,
  ChartModule,
  BreadcrumbModule,
  EventAggpFilterSidebarModule
];

const components = [SessionEventComponent];

const routes: Routes = [
  {
    path: 'session-event',
    component: SessionEventComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionEventModule { }