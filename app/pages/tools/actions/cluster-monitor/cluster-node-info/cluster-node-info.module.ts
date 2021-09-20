import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClusterNodeInfoComponent } from './cluster-node-info.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, ButtonModule, DropdownModule, TabMenuModule, ToolbarModule, TooltipModule } from 'primeng';
import { NodeIndicesComponent } from './node-indices/node-indices.component';
import { NodeQueryComponent } from './node-query/node-query.component';
import { NodeMappingComponent } from './node-mapping/node-mapping.component';
import { NodeRestApiComponent } from './node-rest-api/node-rest-api.component';
import { NodeSettingInformationModule } from '../dialogs/node-setting-information/node-setting-information.module';
import { NodeIndicesModule } from './node-indices/node-indices.module';


const routes: Routes = [
  {
    path: 'cluster-node-info',
    component: ClusterNodeInfoComponent,
    children: [
      {
        path: '',
        redirectTo: 'node-indices',
        pathMatch: 'full',
      },
      {
        path: 'node-indices',
        loadChildren: () =>
          import('./node-indices/node-indices.module').then((m) => m.NodeIndicesModule),
        component: NodeIndicesComponent,
      },
      {
        path: 'node-query',
        loadChildren: () =>
          import('./node-query/node-query.module').then((m) => m.NodeQueryModule),
        component: NodeQueryComponent,
      },
      {
        path: 'node-mapping',
        loadChildren: () =>
          import('./node-mapping/node-mapping.module').then((m) => m.NodeMappingModule),
        component: NodeMappingComponent,
      },
      {
        path: 'node-rest-api',
        loadChildren: () =>
          import('./node-rest-api/node-rest-api.module').then((m) => m.NodeRestApiModule),
        component: NodeRestApiComponent,
      }
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
  TooltipModule,
  TabMenuModule,
  NodeSettingInformationModule,
  NodeIndicesModule
];

const components = [ClusterNodeInfoComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class ClusterNodeInfoModule { }
