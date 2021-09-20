import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarveApplicationComponent } from './starve-application.component';
import { Routes, RouterModule } from '@angular/router';
import { MenuModule, TabMenuModule, ButtonModule, TooltipModule, ToolbarModule, CardModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { CpuBurstComponent } from './cpu-burst/cpu-burst.component';
import { CpuBurstModule } from './cpu-burst/cpu-burst.module';
import { DiskSwindleModule } from './disk-swindle/disk-swindle.module';
import { DiskSwindleComponent } from './disk-swindle/disk-swindle.component';


const components = [StarveApplicationComponent];
const imports = [
  CommonModule,
  MenuModule,
  TabMenuModule,
  ButtonModule,
  TooltipModule,
  CardModule,
  CpuBurstModule,
  DiskSwindleModule
];

const routes: Routes = [
  
  {
    path: 'starve-application',
    component: StarveApplicationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'cpu-burst',
        
      },
      {
        path: 'cpu-burst',
        loadChildren: () =>
          import('./cpu-burst/cpu-burst.module').then(
            (m) => m.CpuBurstModule
          ),
        component: CpuBurstComponent,
      },
      {
        path: 'disk-swindle',
        loadChildren: () =>
          import('./disk-swindle/disk-swindle.module').then(
            (m) => m.DiskSwindleModule
          ),
        component: DiskSwindleComponent,
      }
    ],
  },
];


@NgModule({
  declarations: [components],
  imports: [
    RouterModule.forChild(routes),imports],
  exports: [RouterModule],
})

export class StarveApplicationModule { }
