import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccordionModule, ButtonModule, MenuModule, TabMenuModule, ToolbarModule } from 'primeng';
import { GenericGDFModule } from 'src/app/pages/generic-gdf/generic-gdf.module';
import { LogMonitorCommonComponent } from './log-monitor-common.component';
import { LogPatternMonitorComponent } from '../log-monitors/log-pattern-monitor/log-pattern-monitor.component';
import { LogPatternMonitorModule } from '../log-monitors/log-pattern-monitor/log-pattern-monitor.module';
import { LogDataComponent } from '../log-monitors/log-data-monitor/log-data-monitor.component';
import { LogDataComponentModule } from '../log-monitors/log-data-monitor/log-data-monitor.module';
import { GetLogFileComponent } from '../log-monitors/get-log-file/get-log-file.component';
import { GetLogFileModule } from '../log-monitors/get-log-file/get-log-file.module';


const routes: Routes = [
  {
    path: 'log-monitor-common',
    component: LogMonitorCommonComponent,
    children: [
      {
        path: '',
        redirectTo: 'log-pattern-monitor',
        pathMatch: 'full',
      },
      {
        path: 'log-pattern-monitor',
        loadChildren: () =>
          import('../log-monitors/log-pattern-monitor/log-pattern-monitor.module').then((m) => m.LogPatternMonitorModule),
        component: LogPatternMonitorComponent,
      },
      {
        path: 'log-data-monitor',
        loadChildren: () =>
          import('../log-monitors/log-data-monitor/log-data-monitor.module').then((m) => m.LogDataComponentModule),
        component: LogDataComponent,
      },
      {
        path: 'get-log-file',
        loadChildren: () =>
          import('../log-monitors/get-log-file/get-log-file.module').then((m) => m.GetLogFileModule),
        component: GetLogFileComponent,
      }
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
  AccordionModule
  // LogMetricModule,
  
  
]

@NgModule({
  declarations: [LogMonitorCommonComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ], 
})
export class LogMonitorCommonModule { }
