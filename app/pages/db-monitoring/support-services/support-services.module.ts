import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportServicesComponent } from './support-services.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, CardModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, ChartModule, PanelModule, TabMenuModule } from 'primeng';
import { SupportStatusModule } from './support-status/support-status.module';
import { SupportStatusComponent } from './support-status/support-status.component';
import { BatchJobsComponent } from './batch-jobs/batch-jobs.component';
import { BatchJobsModule } from './batch-jobs/batch-jobs.module';
import { CommonStatsFilterModule } from '../shared/common-stats-filter/common-stats-filter.module';


const imports = [
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
  SupportStatusModule,
  BatchJobsModule,
  CommonStatsFilterModule
];
const components = [SupportServicesComponent];

const routes: Routes = [
  {
    path: 'support-services',
    component: SupportServicesComponent,
    children: [
      {
        path: '',
        redirectTo: 'support-status',
        pathMatch: 'full',
      },
      {
        path: 'support-status',
        loadChildren: () =>
          import('./support-status/support-status.module').then(
            (m) => m.SupportStatusModule
          ),
        component: SupportStatusComponent
      },
      {
        path: 'batch-jobs',
        loadChildren: () =>
          import('./batch-jobs/batch-jobs.module').then(
            (m) => m.BatchJobsModule
          ),
        component: BatchJobsComponent
      },
    ]
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SupportServicesModule { }
