import { NgModule } from '@angular/core';
import { HomeSessionsComponent } from './home-sessions.component';
import { EventRevenueModule } from './event-revenue/event-revenue.module';
import { MessagealertComponent } from './messagealert/messagealert.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  TableModule,
  CardModule,
  ButtonModule,
  ToastModule,
  DialogModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  MenuModule,
  InputTextModule,
  AutoCompleteModule,
  PaginatorModule,
  DropdownModule,
  ToggleButtonModule
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { SessionOverviewComponent } from './session-overview/session-overview.component';
import { SessionOverviewModule } from './session-overview/session-overview.module';
import { SessionFilterModule } from './session-filter/session-filter.module';
import { PathAnalyticsComponent } from './path-analytics/path-analytics.component';
import { PathAnalyticsModule } from './path-analytics/path-analytics.module';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import {TieredMenuModule} from 'primeng/tieredmenu';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ProgressSpinnerModule} from 'primeng/progressspinner';


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
  AutoCompleteModule,
  FormsModule,
  MenuModule,
  DialogModule,
  PipeModule,
  InputTextModule,
  SessionOverviewModule,
  SessionFilterModule,
  PathAnalyticsModule,
  PaginatorModule,
  DropdownModule,
  ChartModule,
  ToggleButtonModule,
  EventRevenueModule,
  TieredMenuModule,
  SelectButtonModule,
  InputSwitchModule,
  ProgressSpinnerModule
];

const components = [HomeSessionsComponent,MessagealertComponent];

const routes: Routes = [
  {
    path: 'home-sessions',
    component: HomeSessionsComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () =>
          import('./session-overview/session-overview.module').then(
            (m) => m.SessionOverviewModule
          ),
        component: SessionOverviewComponent,
      },
      {
        path: 'path-analytics',
        loadChildren: () =>
          import('./path-analytics/path-analytics.module').then(
            (m) => m.PathAnalyticsModule
          ),
        component: PathAnalyticsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeSessionsModule {}
