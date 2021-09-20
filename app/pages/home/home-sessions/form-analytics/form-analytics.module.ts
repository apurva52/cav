import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAnalyticsComponent } from './form-analytics.component';
import { TimeReportComponent } from './time-report/time-report.component';
import { ConversionReportComponent } from './conversion-report/conversion-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule, TableModule, CardModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, ChartModule, PanelModule, TabMenuModule, TabViewModule, InputSwitchModule, ToolbarModule } from 'primeng';
import { ConversionReportModule } from './conversion-report/conversion-report.module';
import { TimeReportModule } from './time-report/time-report.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { OverallReportComponent } from './overall-report/overall-report.component';
import { OverallReportModule } from './overall-report/overall-report.module';
import { DropReportComponent } from './drop-report/drop-report.component';
import { DropReportModule } from './drop-report/drop-report.module';
import { HesitationReportComponent } from './hesitation-report/hesitation-report.component';
import { HesitationReportModule } from './hesitation-report/hesitation-report.module';
import { BlankReportComponent } from './blank-report/blank-report.component';
import { BlankReportModule } from './blank-report/blank-report.module';
import { RefillReportComponent } from './refill-report/refill-report.component';
import { RefillReportModule } from './refill-report/refill-report.module';
import { FormAnalyticsFilterModule } from './form-analytics-filter/form-analytics-filter.module';
const imports = [
  FormAnalyticsFilterModule,
  RefillReportModule,
  BlankReportModule,
  HesitationReportModule,
  DropReportModule,
  ReactiveFormsModule,
  CommonModule,
  BreadcrumbModule,
  HeaderModule,
  ToolbarModule,
  TabViewModule,
  InputSwitchModule,
  CommonModule,
  TableModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  ChartModule,
  PanelModule,
  TabMenuModule,
  TimeReportModule,
  ConversionReportModule,
  OverallReportModule
];
const components = [FormAnalyticsComponent];

const routes: Routes = [
  {
    path: 'form-analytics',
    component: FormAnalyticsComponent,
    children: [
      {
        path: '',
        redirectTo: 'overall-report',
        pathMatch: 'full',
      },
      {
        path: 'conversion-report',
        loadChildren: () =>
          import('./conversion-report/conversion-report.module').then(
            (m) => m.ConversionReportModule
          ),
        component: ConversionReportComponent
      },
      {
        path: 'refill-report',
        loadChildren: () =>
          import('./refill-report/refill-report.module').then(
            (m) => m.RefillReportModule
          ),
        component: RefillReportComponent
      },
      {
        path: 'drop-report',
        loadChildren: () =>
          import('./drop-report/drop-report.module').then(
            (m) => m.DropReportModule
          ),
        component: DropReportComponent
      },
      {
        path: 'blank-report',
        loadChildren: () =>
          import('./blank-report/blank-report.module').then(
            (m) => m.BlankReportModule
          ),
        component: BlankReportComponent
      },
      {
        path: 'hesitation-report',
        loadChildren: () =>
          import('./hesitation-report/hesitation-report.module').then(
            (m) => m.HesitationReportModule
          ),
        component: HesitationReportComponent
      },
      {
        path: 'time-report',
        loadChildren: () =>
          import('./time-report/time-report.module').then(
            (m) => m.TimeReportModule
          ),
        component: TimeReportComponent
      },
      {
        path: 'overall-report',
        loadChildren: () =>
          import('./overall-report/overall-report.module').then(
            (m) => m.OverallReportModule
          ),
        component: OverallReportComponent
      },

    ]
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAnalyticsModule { }
