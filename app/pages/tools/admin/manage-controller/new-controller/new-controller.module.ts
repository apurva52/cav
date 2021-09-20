import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { ToolbarModule, BreadcrumbModule, InputTextModule, ButtonModule, CardModule, MessageModule, CheckboxModule, RadioButtonModule, DropdownModule, AccordionModule, TableModule, MenuModule, TooltipModule, MultiSelectModule } from 'primeng';
import { AddReportSettingsModule } from 'src/app/pages/my-library/reports/metrics/add-report-settings/add-report-settings.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NewControllerComponent } from './new-controller.component';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  InputTextModule,
  ButtonModule,
  CheckboxModule,
  RadioButtonModule,
  DropdownModule,  
  AccordionModule,
  TooltipModule, 
];
const components = [
  NewControllerComponent
];
const routes: Routes = [
  {
    path: 'new-controller',
    component: NewControllerComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],  
})
export class NewControllerModule { }
