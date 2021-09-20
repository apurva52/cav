import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthCheckMonitorSettingComponent } from './health-check-monitor-setting.component';
import { ButtonModule, CheckboxModule, PanelModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';


const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  PanelModule,
  ButtonModule,
  CheckboxModule
  
]

const components = [
  HealthCheckMonitorSettingComponent
];

const routes: Routes = [
  {
    path: 'health-check-monitor-settings',
    component:   HealthCheckMonitorSettingComponent

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
  ],  
})
export class HealthCheckMonitorSettingModule { }
