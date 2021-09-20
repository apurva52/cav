import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceSettingsComponent } from './advance-settings.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { DebugLevelComponent } from './debug-level/debug-level.component';
import { MonitorsComponent } from './monitors/monitors.component';
import { PutDelayInMethodComponent } from './put-delay-in-method/put-delay-in-method.component';
import { GenerateExceptionComponent } from './generate-exception/generate-exception.component';
import { CustomConfigurationComponent } from './custom-configuration/custom-configuration.component';
import { DebugToolComponent } from './debug-tool/debug-tool.component';
import { DynamicLoggingComponent } from './dynamic-logging/dynamic-logging.component';
import { DebugLevelModule } from './debug-level/debug-level.module';
import { MonitorsModule } from './monitors/monitors.module';
import { PutDelayInMethodModule } from './put-delay-in-method/put-delay-in-method.module';
import { GenerateExceptionModule } from './generate-exception/generate-exception.module';
import { CustomConfigurationModule } from './custom-configuration/custom-configuration.module';
import { DebugToolModule } from './debug-tool/debug-tool.module';
import { DynamicLoggingModule } from './dynamic-logging/dynamic-logging.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  DebugLevelModule,
  MonitorsModule,
  PutDelayInMethodModule,
  GenerateExceptionModule,
  CustomConfigurationModule,
  DebugToolModule,
  DynamicLoggingModule
];

const components = [
  AdvanceSettingsComponent
];

const routes: Routes = [
  {
    path: 'advance-settings',
    component: AdvanceSettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'debug-level',
        pathMatch: 'full',
      },
      {
        path: 'debug-level',
        loadChildren: () => import('./debug-level/debug-level.module').then(m => m.DebugLevelModule),
        component: DebugLevelComponent
      },
      {
        path: 'monitors',
        loadChildren: () => import('./monitors/monitors.module').then(m => m.MonitorsModule),
        component: MonitorsComponent
      },
      {
        path: 'put-delay-in-method',
        loadChildren: () => import('./put-delay-in-method/put-delay-in-method.module').then(m => m.PutDelayInMethodModule),
        component: PutDelayInMethodComponent
      },
      {
        path: 'generate-exception',
        loadChildren: () => import('./generate-exception/generate-exception.module').then(m => m.GenerateExceptionModule),
        component: GenerateExceptionComponent
      }, 
      {
        path: 'custom-configuration',
        loadChildren: () => import('./custom-configuration/custom-configuration.module').then(m => m.CustomConfigurationModule),
        component: CustomConfigurationComponent
      }, 
      {
        path: 'debug-tool',
        loadChildren: () => import('./debug-tool/debug-tool.module').then(m => m.DebugToolModule),
        component: DebugToolComponent
      },
      {
        path: 'dynamic-logging',
        loadChildren: () => import('./dynamic-logging/dynamic-logging.module').then(m => m.DynamicLoggingModule),
        component: DynamicLoggingComponent
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


export class AdvanceSettingsModule { }
