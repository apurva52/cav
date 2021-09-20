import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentSessionsComponent } from './current-sessions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, TableModule, ToastModule, MessageModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CurrentSessionFilterModule } from './current-sessions-filter/current-session-filter.module';
import { ViewPartitionModule } from './view-partition/view-partition.module';
import { ViewPartitionComponent } from './view-partition/view-partition.component';
import { ClassicDashboardComponent } from './classic-dashboard/classic-dashboard.component';
import { ClassicDashboardModule } from './classic-dashboard/classic-dashboard.module';
import { TestInitialisationModule } from './test-initialisation/test-initialisation.module';
import { TestInitialisationComponent } from './test-initialisation/test-initialisation.component';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
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
  FieldsetModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,
  MessageModule,
  CurrentSessionFilterModule,
  ViewPartitionModule,
  ClassicDashboardModule,
  TestInitialisationModule
];

const components = [CurrentSessionsComponent];


const routes: Routes = [
  {
    path: 'current-sessions',
    component: CurrentSessionsComponent,
    children: [
      {
        path: 'view-partition',
        loadChildren: () =>
          import('./view-partition/view-partition.module').then(
            (m) => m.ViewPartitionModule
          ),
        component: ViewPartitionComponent,
      },
      {
        path: 'classic-dashboard',
        loadChildren: () =>
          import('./classic-dashboard/classic-dashboard.module').then(
            (m) => m.ClassicDashboardModule
          ),
        component: ClassicDashboardComponent,
      },
      {
        path: 'test-initialisation',
        loadChildren: () =>
          import('./test-initialisation/test-initialisation.module').then(
            (m) => m.TestInitialisationModule
          ),
        component: TestInitialisationComponent,
      },
     
    ],
  },
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CurrentSessionsModule { }
