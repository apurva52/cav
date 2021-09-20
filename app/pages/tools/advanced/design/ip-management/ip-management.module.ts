import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpManagementComponent } from './ip-management.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { Routes, RouterModule } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PropertiesComponent } from './properties/properties.component';
import { PropertiesModule } from './properties/properties.module';
import { IpComponent } from './ip/ip.component';
import { IpModule } from './ip/ip.module';
import { ConnectivityModule } from './connectivity/connectivity.module';
import { ConnectivityComponent } from './connectivity/connectivity.component';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  TabMenuModule,
  PropertiesModule,
  IpModule,
  ConnectivityModule
]

const components = [
  IpManagementComponent
];

const routes: Routes = [
  {
    path: 'ip-management',
    component: IpManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'ip',
        pathMatch: 'full',
      },
      {
        path: 'properties',
        loadChildren: () => import('./properties/properties.module').then(m => m.PropertiesModule),
        component: PropertiesComponent
      },
      {
        path: 'ip',
        loadChildren: () => import('./ip/ip.module').then(m => m.IpModule),
        component: IpComponent
      },
      {
        path: 'connectivity',
        loadChildren: () => import('./connectivity/connectivity.module').then(m => m.ConnectivityModule),
        component: ConnectivityComponent
      },
    
    ]
  }
]

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
export class IpManagementModule { }
