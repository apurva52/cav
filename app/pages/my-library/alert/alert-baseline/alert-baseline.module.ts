import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertBaselineComponent } from './alert-baseline.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { DropdownModule, InputTextModule, ButtonModule, DialogModule, RadioButtonModule, MessageModule, ToolbarModule, CardModule, CheckboxModule, TableModule, BreadcrumbModule, MenuModule, MultiSelectModule, TooltipModule, ToggleButtonModule, InputSwitchModule } from 'primeng';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { TimeBarModule } from 'src/app/shared/time-bar/time-bar.module';
import { AddBaselineModule } from './add-baseline/add-baseline.module';


const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  BreadcrumbModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MenuModule,
  MultiSelectModule,
  TimeBarModule,
  TooltipModule,
  ToggleButtonModule,
  InputSwitchModule,
  AddBaselineModule

  
 
];


const components = [AlertBaselineComponent];

const routes: Routes = [
  {
    path: 'alert-baseline',
    component: AlertBaselineComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertBaselineModule { }
