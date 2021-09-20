import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsDetailsComponent } from './sessions-details.component';
import { BreadcrumbModule, ButtonModule, CardModule, MenuModule, TabMenuModule, ToolbarModule, DialogModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { SessionPageDetailsComponent } from './session-page-details/session-page-details.component';
import { SessionPageComponent } from './session-page/session-page.component';
import { CustomMetricsComponent } from './custom-metrics/custom-metrics.component';
import { AppCrashComponent } from './app-crash/app-crash.component';
import { DeviceInfoComponent } from './device-info/device-info.component';
import { LocationInfoComponent } from './location-info/location-info.component';
import { DevicePreferenceComponent } from './device-preference/device-preference.component';
import { MethodTraceComponent } from './method-trace/method-trace.component';
import { SessionDataModule } from './session-data/session-data.module';
import { ScatterMapModule } from 'src/app/shared/scatter-map/scatter-map.module';
import { AngularResizedEventModule } from 'angular-resize-event'; 
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  SessionDataModule,
  CardModule,
  MenuModule,
  ScatterMapModule,
  AngularResizedEventModule,
  DialogModule,
  FormsModule
];


const components = [
  SessionsDetailsComponent
];

const routes: Routes = [
  {
    path: 'sessions-details',
    component: SessionsDetailsComponent,
    children: [
      {
        path: '',
        redirectTo: 'session-page-details',
        pathMatch: 'full',
      },
      {
        path: 'session-page-details',
        loadChildren: () => import('./session-page-details/session-page-details.module').then(m => m.SessionPageDetailsModule),
        component: SessionPageDetailsComponent
      },
      {
        path: 'session-page',
        loadChildren: () => import('./session-page/session-page.module').then(m => m.SessionPageModule),
        component: SessionPageComponent
      },
      {
        path: 'custom-metrics',
        loadChildren: () => import('./custom-metrics/custom-metrics.module').then(m => m.CustomMetricsModule),
        component: CustomMetricsComponent
      },
      {
        path: 'app-crash',
        loadChildren: () => import('./app-crash/app-crash.module').then(m => m.AppCrashModule),
        component: AppCrashComponent
      },
      {
        path: 'device-info',
        loadChildren: () => import('./device-info/device-info.module').then(m => m.DeviceInfoModule),
        component: DeviceInfoComponent
      },
      {
        path: 'location-info',
        loadChildren: () => import('./location-info/location-info.module').then(m => m.LocationInfoModule),
        component: LocationInfoComponent
      },
      {
        path: 'device-preference',
        loadChildren: () => import('./device-preference/device-preference.module').then(m => m.DevicePreferenceModule),
        component: DevicePreferenceComponent
      },
      {
        path: 'method-trace',
        loadChildren: () => import('./method-trace/method-trace.module').then(m => m.MethodTraceModule),
        component: MethodTraceComponent
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
export class SessionsDetailsModule { }
