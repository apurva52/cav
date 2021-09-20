import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingAnalyticsComponent } from './marketing-analytics.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule, ButtonModule, BreadcrumbModule, TabMenuModule, InputTextModule, MessageModule, DialogModule, CardModule, DropdownModule, CheckboxModule, TableModule, MultiSelectModule, MenuModule, TooltipModule, RadioButtonModule, RatingModule, PanelModule, SidebarModule, ToastModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FeedbackFilterModule } from './sidebars/feedback-filter/feedback-filter.module';
import { MarketingAnalyticsFilterComponent } from './marketing-analytics-filter/marketing-analytics-filter.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { TimeFilterModule } from 'src/app/shared/time-filter/time-filter/time-filter.module';
import { MarketingAnalyticsDetailComponent } from './marketing-analytics-detail/marketing-analytics-detail.component';

const imports = [
  CommonModule,
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  BreadcrumbModule,
  TooltipModule,
  RadioButtonModule,
  RatingModule,
  PanelModule,
  ChartModule,
  HeaderModule,
  FeedbackFilterModule,
  FormsModule,
  ReactiveFormsModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  SidebarModule,
  TimeFilterModule,
  ToastModule
]

const components = [MarketingAnalyticsComponent];

const routes: Routes = [
  {
    path: 'marketing-analytics',
    component: MarketingAnalyticsComponent,
  },
  {
    path: 'ma-detail',
    component: MarketingAnalyticsDetailComponent
  }
];

@NgModule({
  declarations: [components, MarketingAnalyticsFilterComponent, MarketingAnalyticsDetailComponent,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class MarketingAnalyticsModule { }
