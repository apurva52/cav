import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionFilterComponent } from './session-filter.component';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, InputTextModule, MessageModule, RadioButtonModule, SelectButtonModule, SidebarModule, TabViewModule, TooltipModule, ToastModule, MultiSelectModule, FieldsetModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';

const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  ReactiveFormsModule,
  InputTextModule, 
  DropdownModule,
  SidebarModule,
  DropdownModule,
  RadioButtonModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  CheckboxModule,
  TabViewModule,
  SelectButtonModule,
  AccordionModule,
  ToastModule,
  MultiSelectModule,
  FieldsetModule
];

const components = [SessionFilterComponent];

const routes: Routes = [
  {
    path: 'session-filter',
    component: SessionFilterComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class SessionFilterModule { }
