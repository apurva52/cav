import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfrastructureViewComponent } from './infrastructure-view.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { OverviewComponent } from './overview/overview.component';
import { OngoingTestComponent } from './ongoing-test/ongoing-test.component';
import { OverviewModule } from './overview/overview.module';
import { OngoingTestModule } from './ongoing-test/ongoing-test.module';
import { ProjectComponent } from './project/project.component';
import { EnvironmentComponent } from './environment/environment.component';
import { DiskUsageComponent } from './disk-usage/disk-usage.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ReportComponent } from './report/report.component';
import { ControllersComponent } from './controllers/controllers.component';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule
];


const components = [
  InfrastructureViewComponent
];

const routes: Routes = [
  {
    path: 'infrastructure-view',
    component: InfrastructureViewComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadChildren: () => import('./overview/overview.module').then(m => m.OverviewModule),
        component: OverviewComponent
      },
      {
        path: 'ongoing-test',
        loadChildren: () => import('./ongoing-test/ongoing-test.module').then(m => m.OngoingTestModule),
        component: OngoingTestComponent
      },
      {
        path: 'projects',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        component: ProjectComponent
      },
      {
        path: 'environment',
        loadChildren: () => import('./environment/environment.module').then(m => m.EnvironmentModule),
        component: EnvironmentComponent
      },
      {
        path: 'disk-usage',
        loadChildren: () => import('./disk-usage/disk-usage.module').then(m => m.DiskUsageModule),
        component: DiskUsageComponent
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
        component: InventoryComponent
      },
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
        component: ReportComponent
      },
      {
        path: 'controllers',
        loadChildren: () => import('./controllers/controllers.module').then(m => m.ControllersModule),
        component: ControllersComponent
      },
    ]
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
  ]
})

export class InfrastructureViewModule { }
