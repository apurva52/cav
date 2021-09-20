import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagePerformanceOverviewComponent } from './page-performance-overview.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PageComponent } from './page/page.component';
import { DeviceComponent } from './device/device.component';
import { BrowserComponent } from './browser/browser.component';
import { BrowserVersionComponent } from './browser-version/browser-version.component';
import { ConnectionComponent } from './connection/connection.component';
import { LocationComponent } from './location/location.component';
import { RegionComponent } from './region/region.component';
import { OsComponent } from './os/os.component';
import { OsVersionComponent } from './os-version/os-version.component';
import { BrowserAndOsComponent } from './browser-and-os/browser-and-os.component';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule
];


const components = [
  PagePerformanceOverviewComponent
];

const routes: Routes = [
  {
    path: 'page-performance-overview',
    component: PagePerformanceOverviewComponent,
    children: [
      {
        path: '',
        redirectTo: 'page',
        pathMatch: 'full',
      },
      {
        path: 'page',
        loadChildren: () => import('./page/page.module').then(m => m.PageModule),
        component: PageComponent
      },
      {
        path: 'device',
        loadChildren: () => import('./device/device.module').then(m => m.DeviceModule),
        component: DeviceComponent
      },
      {
        path: 'browser',
        loadChildren: () => import('./browser/browser.module').then(m => m.BrowserModule),
        component: BrowserComponent
      },
      {
        path: 'browser-version',
        loadChildren: () => import('./browser-version/browser-version.module').then(m => m.BrowserVersionModule),
        component: BrowserVersionComponent
      },
      {
        path: 'connection',
        loadChildren: () => import('./connection/connection.module').then(m => m.ConnectionModule),
        component: ConnectionComponent
      },
      {
        path: 'location',
        loadChildren: () => import('./location/location.module').then(m => m.LocationModule),
        component: LocationComponent
      },
      {
        path: 'region',
        loadChildren: () => import('./region/region.module').then(m => m.RegionModule),
        component: RegionComponent
      },
      {
        path: 'os',
        loadChildren: () => import('./os/os.module').then(m => m.OsModule),
        component: OsComponent
      },
      {
        path: 'os-version',
        loadChildren: () => import('./os-version/os-version.module').then(m => m.OsVersionModule),
        component: OsVersionComponent
      },
      {
        path: 'browser-os',
        loadChildren: () => import('./browser-and-os/browser-and-os.module').then(m => m.BrowserAndOsModule),
        component: BrowserAndOsComponent
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
export class PagePerformanceOverviewModule { }
