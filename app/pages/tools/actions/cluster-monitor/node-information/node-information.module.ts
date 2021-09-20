import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeInformationComponent } from './node-information.component';
import { RouterModule, Routes } from '@angular/router';
import {
  DropdownModule,
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  InputTextModule,
  TooltipModule,
  TableModule,
  TabMenuModule, MenuModule
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { JvmComponent } from './jvm/jvm.component';
import { FileSystemComponent } from './file-system/file-system.component';
import { IndicesComponent } from './indices/indices.component';
import { NetworkComponent } from './network/network.component';
import { OperatingSystemsComponent } from './operating-systems/operating-systems.component';
import { ProcessComponent } from './process/process.component';
import { ThreadPoolsComponent } from './thread-pools/thread-pools.component';
import { NodeSettingInformationModule } from '../dialogs/node-setting-information/node-setting-information.module';

const routes: Routes = [
  {
    path: 'node-info',
    component: NodeInformationComponent,
    children: [
      {
        path: '',
        redirectTo: 'jvm',
        pathMatch: 'full',
      },
      {
        path: 'jvm',
        loadChildren: () =>
          import('./jvm/jvm.module').then((m) => m.JvmModule),
        component: JvmComponent,
      },
      {
        path: 'indices',
        loadChildren: () =>
          import('./indices/indices.module').then((m) => m.IndicesModule),
        component: IndicesComponent,
      },
      {
        path: 'operating-systems',
        loadChildren: () =>
          import('./operating-systems/operating-systems.module').then((m) => m.OperatingSystemsModule),
        component: OperatingSystemsComponent,
      },
      {
        path: 'process',
        loadChildren: () =>
          import('./process/process.module').then((m) => m.ProcessModule),
        component: ProcessComponent,
      },
      {
        path: 'thread-pools',
        loadChildren: () =>
          import('./thread-pools/thread-pools.module').then((m) => m.ThreadPoolsModule),
        component: ThreadPoolsComponent,
      },
      {
        path: 'network',
        loadChildren: () =>
          import('./network/network.module').then((m) => m.NetworkModule),
        component: NetworkComponent,
      },
      {
        path: 'file-system',
        loadChildren: () =>
          import('./file-system/file-system.module').then((m) => m.FileSystemModule),
        component: FileSystemComponent,
      },
    ],
  },
];

const imports = [
  CommonModule,
  HeaderModule,
  DropdownModule,
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  InputTextModule,
  ChartModule,
  TooltipModule,
  TableModule,
  TabMenuModule,
  MenuModule,
  NodeSettingInformationModule
];

const components = [NodeInformationComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class NodeInformationModule {}
