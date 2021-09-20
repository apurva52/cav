import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstrumentMonitorsComponent } from './instrument-monitors.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, TabViewModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { MethodMonitorComponent } from './method-monitor/method-monitor.component';
import { StatsMonitorComponent } from './stats-monitor/stats-monitor.component';
import { ExceptionMonitorComponent } from './exception-monitor/exception-monitor.component';
import { JamThreadCpuMonitorComponent } from './jam-thread-cpu-monitor/jam-thread-cpu-monitor.component';
import { MethodMonitorModule } from './method-monitor/method-monitor.module';
import { JamThreadCpuMonitorModule } from './jam-thread-cpu-monitor/jam-thread-cpu-monitor.module';
import { StatsMonitorModule } from './stats-monitor/stats-monitor.module';
import { ExceptionMonitorModule } from './exception-monitor/exception-monitor.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  MethodMonitorModule,
  TabViewModule,
  StatsMonitorModule,
  ExceptionMonitorModule,
  JamThreadCpuMonitorModule
];

const components = [
  InstrumentMonitorsComponent
];

const routes: Routes = [
  {
    path: 'instrument-monitors',
    component: InstrumentMonitorsComponent,
    children: [
      {
        path: '',
        redirectTo: 'method-monitor',
        pathMatch: 'full',
      },
      {
        path: 'method-monitor',
        loadChildren: () => import('./method-monitor/method-monitor.module').then(m => m.MethodMonitorModule),
        component: MethodMonitorComponent
      },
      {
        path: 'stats-monitor',
        loadChildren: () => import('./stats-monitor/stats-monitor.module').then(m => m.StatsMonitorModule),
        component: StatsMonitorComponent
      },
      {
        path: 'exception-monitor',
        loadChildren: () => import('./exception-monitor/exception-monitor.module').then(m => m.ExceptionMonitorModule),
        component: ExceptionMonitorComponent
      },
      {
        path: 'jam-thread-cpu-monitor',
        loadChildren: () => import('./jam-thread-cpu-monitor/jam-thread-cpu-monitor.module').then(m => m.JamThreadCpuMonitorModule),
        component: JamThreadCpuMonitorComponent
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
export class InstrumentMonitorsModule { }
