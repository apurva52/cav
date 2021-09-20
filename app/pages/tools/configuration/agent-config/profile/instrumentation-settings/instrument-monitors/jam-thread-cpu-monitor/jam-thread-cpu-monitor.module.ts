import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JamThreadCpuMonitorComponent } from './jam-thread-cpu-monitor.component';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,     
];

const components = [JamThreadCpuMonitorComponent];

const routes: Routes = [
  {
    path: 'jam-thread-cpu-monitor',
    component: JamThreadCpuMonitorComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components,RouterModule],
})
export class JamThreadCpuMonitorModule { }
