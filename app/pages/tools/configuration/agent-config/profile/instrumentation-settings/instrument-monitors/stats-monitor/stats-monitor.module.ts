import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsMonitorComponent } from './stats-monitor.component';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,    
];

const components = [StatsMonitorComponent];

const routes: Routes = [
  {
    path: 'stats-monitor',
    component: StatsMonitorComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components,RouterModule],
})
export class StatsMonitorModule { }
