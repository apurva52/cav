import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageFilterComponent } from './page-filter.component';
import { ButtonModule, CardModule, CheckboxModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToastModule, ToolbarModule, TooltipModule, BreadcrumbModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { SessionOverviewModule } from '../session-overview/session-overview.module';
import { PathAnalyticsModule } from '../path-analytics/path-analytics.module';
import { SessionFilterModule } from '../session-filter/session-filter.module';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PageFilterSidebarModule } from './sidebar/page-filter-sidebar/page-filter-sidebar.module';
import { PageScatterMapModule } from './page-scatter-map/page-scatter-map.module';
import { EventRevenueModule } from '../event-revenue/event-revenue.module';
import {ClipboardModule} from '@angular/cdk/clipboard'; 
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng';

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
  SessionOverviewModule,
  SessionFilterModule,
  PathAnalyticsModule,
  HeaderModule,
  ToolbarModule,
  PageFilterSidebarModule,
  PageScatterMapModule,
  EventRevenueModule,
  BreadcrumbModule,
  ClipboardModule,
  ProgressSpinnerModule,
  AutoCompleteModule
];

const components = [PageFilterComponent];

const routes: Routes = [
  {
    path: 'page-filter',
    component: PageFilterComponent,
    // children: [
    //   {
    //     path: 'overview',
    //     loadChildren: () =>
    //       import('./session-overview/session-overview.module').then(
    //         (m) => m.SessionOverviewModule
    //       ),
    //     component: SessionOverviewComponent,
    //   },
    //   {
    //     path: 'path-analytics',
    //     loadChildren: () =>
    //       import('./path-analytics/path-analytics.module').then(
    //         (m) => m.PathAnalyticsModule
    //       ),
    //     component: PathAnalyticsComponent,
    //   },
    // ],
  }
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PageFilterModule { }
