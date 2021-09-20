import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductIntegrationSettingsComponent } from './product-integration-settings.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { NdSessionsComponent } from './nd-sessions/nd-sessions.component';
import { NdAutoInjectComponent } from './nd-auto-inject/nd-auto-inject.component';
import { NdSettingsComponent } from './nd-settings/nd-settings.component';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule
];

const components = [
  ProductIntegrationSettingsComponent
];

const routes: Routes = [
  {
    path: 'product-integration-settings',
    component: ProductIntegrationSettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'nd-sessions',
        pathMatch: 'full',
      },
      {
        path: 'nd-sessions',
        loadChildren: () => import('./nd-sessions/nd-sessions.module').then(m => m.NdSessionsModule),
        component: NdSessionsComponent
      },
      {
        path: 'nd-auto-inject',
        loadChildren: () => import('./nd-auto-inject/nd-auto-inject.module').then(m => m.NdAutoInjectModule),
        component: NdAutoInjectComponent
      },
      {
        path: 'nd-settings',
        loadChildren: () => import('./nd-settings/nd-settings.module').then(m => m.NdSettingsModule),
        component: NdSettingsComponent
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
export class ProductIntegrationSettingsModule { }
