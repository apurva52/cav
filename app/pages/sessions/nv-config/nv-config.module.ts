import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NvConfigComponent } from './nv-config.component';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PageNameComponent } from './page-name/page-name.component';
import { CustomDataComponent } from './custom-data/custom-data.component';
import { UserSegmentComponent } from './user-segment/user-segment.component';
import { ClusterComponent } from './cluster/cluster.component';
import { ChannelComponent } from './channel/channel.component';
import { CheckPointComponent } from './check-point/check-point.component';
import { EventsModule } from './events/events.module';
import { PageNameModule } from './page-name/page-name.module';
import { CustomDataModule } from './custom-data/custom-data.module';
import { UserSegmentModule } from './user-segment/user-segment.module';
import { ClusterModule } from './cluster/cluster.module';
import { CheckPointModule } from './check-point/check-point.module';
import { ChannelModule } from './channel/channel.module';
import { BusinessProcessModule } from './business-process/business-process.module';
import { BusinessProcessComponent } from './business-process/business-process.component';
import { FlowchartModule } from './flowchart/flowchart.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  FlowchartModule,
  EventsModule,
  PageNameModule,
  CustomDataModule,
  UserSegmentModule,
  ClusterModule,
  ChannelModule,
  CheckPointModule
]

const components = [
  NvConfigComponent
];

const routes: Routes = [
  {
    path: 'nv-config',
    component: NvConfigComponent,
    children: [
      {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full',
      },
      {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
        component: EventsComponent
      },
      {
        path: 'page-name',
        loadChildren: () => import('./page-name/page-name.module').then(m => m.PageNameModule),
        component: PageNameComponent
      },
      {
        path: 'custom-data',
        loadChildren: () => import('./custom-data/custom-data.module').then(m => m.CustomDataModule),
        component: CustomDataComponent
      },
      {
        path: 'user-segment',
        loadChildren: () => import('./user-segment/user-segment.module').then(m => m.UserSegmentModule),
        component: UserSegmentComponent
      },
      {
        path: 'cluster',
        loadChildren: () => import('./cluster/cluster.module').then(m => m.ClusterModule),
        component: ClusterComponent
      },
      {
        path: 'channel',
        loadChildren: () => import('./channel/channel.module').then(m => m.ChannelModule),
        component: ChannelComponent
      },
      {
        path: 'check-point',
        loadChildren: () => import('./check-point/check-point.module').then(m => m.CheckPointModule),
        component: CheckPointComponent
      },
      {
        path: 'business-process',
        loadChildren: () => import('./business-process/business-process.module').then(m => m.BusinessProcessModule),
        component: BusinessProcessComponent
      },
    ]
  }
]

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

export class NvConfigModule { }

