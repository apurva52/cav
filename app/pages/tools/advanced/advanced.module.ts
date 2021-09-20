import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedComponent } from './advanced.component';
import { RouterModule, Routes } from '@angular/router';
import { ViewPartitionComponent } from './current-sessions/view-partition/view-partition.component';
import { ViewPartitionModule } from './current-sessions/view-partition/view-partition.module';
import { ClassicDashboardComponent } from './current-sessions/classic-dashboard/classic-dashboard.component';
import { ClassicDashboardModule } from './current-sessions/classic-dashboard/classic-dashboard.module';
import { ChartModule } from 'primeng';
import { ApplianceHealthComponent } from './health/appliance-health/appliance-health.component';
import { ApplianceHealthModule } from './health/appliance-health/appliance-health.module';

const routes: Routes = [
  {
    path: 'advanced',
    component: AdvancedComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'view-partition',
        loadChildren: () =>
          import(
            './current-sessions/view-partition/view-partition.module'
          ).then((m) => m.ViewPartitionModule),
        component: ViewPartitionComponent,
      },
      {
        path: 'classic-dashboard',
        loadChildren: () =>
          import(
            './current-sessions/classic-dashboard/classic-dashboard.module'
          ).then((m) => m.ClassicDashboardModule),
        component: ClassicDashboardComponent,
      },
      {
        path: 'application-health',
        loadChildren: () =>
          import('./health/appliance-health/appliance-health.module').then(
            (m) => m.ApplianceHealthModule
          ),
        component: ApplianceHealthComponent,
      },
    ],
  },
];

const imports = [
  CommonModule,
  ViewPartitionModule,
  ClassicDashboardModule,
  ChartModule,
  ApplianceHealthModule,
];

const components = [AdvancedComponent];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancedModule {}
