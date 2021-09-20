import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetentionPolicyComponent } from './retention-policy.component';
import { RouterModule, Routes } from '@angular/router';
import { GlobalConfigurationComponent } from './global-configuration/global-configuration.component';
import { CleanupConfigurationComponent } from './cleanup-configuration/cleanup-configuration.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
];


const components = [
  RetentionPolicyComponent
];

const routes: Routes = [
  {
    path: 'retention-policy',
    component: RetentionPolicyComponent,
    children: [
      {
        path: '',
        redirectTo: 'global-configuration',
        pathMatch: 'full',
      },
      {
        path: 'global-configuration',
        loadChildren: () => import('./global-configuration/global-configuration.module').then(m => m.GlobalConfigurationModule),
        component: GlobalConfigurationComponent
      },
      {
        path: 'cleanup-configuration',
        loadChildren: () => import('./cleanup-configuration/cleanup-configuration.module').then(m => m.CleanupConfigurationModule),
        component: CleanupConfigurationComponent
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
export class RetentionPolicyModule { }
