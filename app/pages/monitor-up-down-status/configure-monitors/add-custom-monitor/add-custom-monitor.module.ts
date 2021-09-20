import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomMonitorComponent } from './add-custom-monitor.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ButtonModule, MenuModule, TabMenuModule, ToolbarModule } from 'primeng';
import { AvailableCustomMonitorsComponent } from './available-custom-monitors/available-custom-monitors.component';

const routes: Routes = [
  {
    path: 'custom-monitors',
    component: AddCustomMonitorComponent,
    children: [
      {
        path: 'availCustMon/:monType',
        loadChildren: () =>
          import('./available-custom-monitors/available-custom-monitors.module').then((m) => m.AvailableCustomMonitorsModule),
        component: AvailableCustomMonitorsComponent,
      },
    ]
  }
];

const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  MenuModule,
  TabMenuModule,
  ButtonModule,
]

@NgModule({
  declarations: [AddCustomMonitorComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ], 
})
export class AddCustomMonitorModule { }
