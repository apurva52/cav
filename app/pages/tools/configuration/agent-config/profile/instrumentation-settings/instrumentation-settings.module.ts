import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentationSettingsComponent } from './instrumentation-settings.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { ServiceEntryPointComponent } from './service-entry-point/service-entry-point.component';
import { IntegrationPointComponent } from './integration-point/integration-point.component';
import { BusinessTransactionComponent } from './business-transaction/business-transaction.component';
import { InstrumentMonitorsComponent } from './instrument-monitors/instrument-monitors.component';
import { ErrorDetectionComponent } from './error-detection/error-detection.component';
import { AsynchronousTransactionComponent } from './asynchronous-transaction/asynchronous-transaction.component';
import { SettingsModule } from './integration-point/settings/settings.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  SettingsModule
];

const components = [
  InstrumentationSettingsComponent
];

const routes: Routes = [
  {
    path: 'instrumentation-settings',
    component: InstrumentationSettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'service-entry-point',
        pathMatch: 'full',
      },
      {
        path: 'service-entry-point',
        loadChildren: () => import('./service-entry-point/service-entry-point.module').then(m => m.ServiceEntryPointModule),
        component: ServiceEntryPointComponent
      },
      {
        path: 'integration-point',
        loadChildren: () => import('./integration-point/integration-point.module').then(m => m.IntegrationPointModule),
        component: IntegrationPointComponent
      },
      {
        path: 'business-transaction',
        loadChildren: () => import('./business-transaction/business-transaction.module').then(m => m.BusinessTransactionModule),
        component: BusinessTransactionComponent
      },
      {
        path: 'instrument-monitors',
        loadChildren: () => import('./instrument-monitors/instrument-monitors.module').then(m => m.InstrumentMonitorsModule),
        component: InstrumentMonitorsComponent
      },
      {
        path: 'error-detection',
        loadChildren: () => import('./error-detection/error-detection.module').then(m => m.ErrorDetectionModule),
        component: ErrorDetectionComponent
      },
      {
        path: 'asynchronous-transaction',
        loadChildren: () => import('./asynchronous-transaction/asynchronous-transaction.module').then(m => m.AsynchronousTransactionModule),
        component: AsynchronousTransactionComponent
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
export class InstrumentationSettingsModule { }
