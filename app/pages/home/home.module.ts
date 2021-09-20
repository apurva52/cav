import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { SystemComponent } from './system/system.component';
import { FunnelComponent } from './funnel/funnel.component';
import { EventsComponent } from './events/events.component';
import { HomeSessionsComponent } from './home-sessions/home-sessions.component';
import { LogstabComponent } from './logstab/logstab.component';
import {
  TabMenuModule,
  MenuModule,
  ButtonModule,
  ToolbarModule,
  TooltipModule,
  MegaMenuModule,
  PanelMenuModule,
  SidebarModule,
  CardModule
} from 'primeng';

import { MatTabsModule } from "@angular/material/tabs";
import { DragDropModule } from '@angular/cdk/drag-drop';
//import { HeaderModule}

import { HeaderModule } from 'src/app/shared/header/header.module';
import { TimeBarModule } from 'src/app/shared/time-bar/time-bar.module';
import { CommonModule } from '@angular/common';
import { HomeSessionsModule } from './home-sessions/home-sessions.module';
import { NetHavocComponent } from './net-havoc/net-havoc.component';
import { NetHavocModule } from './net-havoc/net-havoc.module';
import { AuthGuard } from '../tools/configuration/nd-config/guards/auth.guard';
import { HomeNsmComponent } from './home-nsm/home-nsm.component'; 
import { homeNsmModule } from './home-nsm/home-nsm.module'; 
// import { AgmCoreModule } from '@agm/core';

const components = [HomeComponent];
const imports = [
  CommonModule,
  HeaderModule,
  TimeBarModule,
  MenuModule,
  TabMenuModule,
  ButtonModule,
  TooltipModule,
  HomeSessionsModule,
  NetHavocModule,
  MatTabsModule,
  DragDropModule,
  homeNsmModule,
  MegaMenuModule,
  PanelMenuModule,
  ToolbarModule,
  SidebarModule,
  CardModule,
  //AgmCoreModule
];

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard-page/dashboard-page.module').then(
            (m) => m.DashboardPageModule
          ),
        component: DashboardPageComponent,
        canDeactivate:[AuthGuard],
      }, 
       
      {
        path: 'system',
        loadChildren: () =>
          import('./system/system.module').then((m) => m.SystemModule),
        component: SystemComponent,
      },
      {
        path: 'funnel',
        loadChildren: () =>
          import('./funnel/funnel.module').then((m) => m.FunnelModule),
        component: FunnelComponent,
      },
      {
        path: 'events',
        loadChildren: () =>
          import('./events/events.module').then((m) => m.EventsModule),
        component: EventsComponent,
      },
      {
        path: 'home-sessions',
        loadChildren: () =>
          import('./home-sessions/home-sessions.module').then(
            (m) => m.HomeSessionsModule
          ),
        component: HomeSessionsComponent,
      },
      {
        path: 'logs',
        loadChildren: () =>
          import('./logstab/logstab.module').then((m) => m.LogstabModule),
        component: LogstabComponent,
      },
      {
        path: 'net-havoc',
        loadChildren: () =>
          import('./net-havoc/net-havoc.module').then((m) => m.NetHavocModule),
        component: NetHavocComponent,
      },  
     
      {
        path: 'home-nsm',
        loadChildren: () =>
          import('./home-nsm/home-nsm.module').then((m) => m.homeNsmModule),
        component: HomeNsmComponent ,
      }, 
    ],
  },
];


@NgModule({
  declarations: [components,],
  imports: [RouterModule.forChild(routes), imports, 
  //   AgmCoreModule.forRoot({
  //   apiKey: "your API key here"
  // })
],
})
export class HomeModule {}
