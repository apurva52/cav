import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NdSettingComponent } from './nd-setting.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, TabMenuModule, ToolbarModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { NdCollectorSettingsComponent } from './custom-configuration/nd-collector-settings/nd-collector-settings.component';
import { SettingsComponent } from './settings/settings.component';
import { CustomConfigurationComponent } from './custom-configuration/custom-configuration.component';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  
];


const components = [
  NdSettingComponent
];

const routes: Routes = [
  {
    path: 'nd-setting',
    component: NdSettingComponent,
    children: [
      {
        path: '',
        redirectTo: 'setting',
        pathMatch: 'full',
      },
      {
        path: 'setting',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        component: SettingsComponent
      },
      {
        path: 'custom-configuration',
        loadChildren: () => import('./custom-configuration/custom-configuration.module').then(m => m.CustomConfigurationModule),
        component: CustomConfigurationComponent
      }
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

export class NdSettingModule { }
