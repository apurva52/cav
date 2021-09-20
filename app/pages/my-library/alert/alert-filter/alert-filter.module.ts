import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertFilterComponent } from './alert-filter.component';
import {
  AccordionModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FieldsetModule,
  MessageModule,
  PanelModule,
  SelectButtonModule,
  SidebarModule,
  TooltipModule,
  MultiSelectModule
} from 'primeng';

import { InputTextModule } from 'primeng/inputtext';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  InputTextModule,
  DropdownModule,
  SidebarModule,
  PanelModule,
  DropdownModule,
  SelectButtonModule,
  FieldsetModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  AccordionModule,
  MultiSelectModule
];

const components = [AlertFilterComponent];

const routes: Routes = [
  {
    path: 'alert-filter',
    component: AlertFilterComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class AlertFilterModule {}
