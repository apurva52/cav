import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PathAnalyticsComponent } from './path-analytics.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { Routes, RouterModule } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PathAnalyticsFilterComponent } from 'src/app/pages/home/home-sessions/path-analytics/path-analytics-filter/path-analytics-filter.component';
import {  CarouselModule, CardModule, AccordionModule, CheckboxModule, BreadcrumbModule, ButtonModule, DialogModule, DropdownModule, InputSwitchModule, 
  InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, ToolbarModule, 
  TooltipModule, SidebarModule, ToastModule, ProgressBarModule } from 'primeng';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { ViewflowpathanalysisComponent } from 'src/app/pages/home/home-sessions/path-analytics/viewflowpathanalysis/viewflowpathanalysis.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { TimeFilterModule } from 'src/app/shared/time-filter/time-filter/time-filter.module';
import { NavigationpathanalysisComponent } from 'src/app/pages/home/home-sessions/path-analytics/navigationpathanalysis/navigationpathanalysis.component';



const imports = [
  ToastModule,
  OwlDateTimeModule,
  TimeFilterModule,
  CommonModule,
  ChartModule,
  CarouselModule,
  CardModule,
  AccordionModule,
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,  
  PanelModule, 
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  MessageModule,
  DialogModule,
  TableModule,
  TooltipModule,
  SidebarModule,
  //OwlDateTimeModule,
  OwlMomentDateTimeModule,
  ReactiveFormsModule,
  //TimeFilterModule,
  ProgressBarModule
  
];

  
const components = [PathAnalyticsComponent,ViewflowpathanalysisComponent,NavigationpathanalysisComponent,PathAnalyticsFilterComponent];

const routes: Routes = [
  {
    path: 'path-analytics',
    component: PathAnalyticsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class PathAnalyticsModule {}
