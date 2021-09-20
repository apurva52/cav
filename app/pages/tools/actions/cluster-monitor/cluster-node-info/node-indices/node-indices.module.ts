import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeIndicesComponent } from './node-indices.component';
import { Routes, RouterModule } from '@angular/router';
import {
  DropdownModule,
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  TooltipModule,
  TabMenuModule, TableModule, InputTextModule, MultiSelectModule, CardModule, MenuModule
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { CreateIndicesModule } from '../../dialogs/create-indices/create-indices.module';
import { IndicesFilterModule } from '../../sidebars/indices-filter/indices-filter.module';
import { IndicesFlushModule } from '../../dialogs/indices-flush/indices-flush.module';
import { IndicesOptimizeModule } from '../../dialogs/indices-optimize/indices-optimize.module';
import { IndicesRefreshModule } from '../../dialogs/indices-refresh/indices-refresh.module';
import { SubIndicesComponent } from './sub-indices/sub-indices.component';
import { SubIndicesModule } from './sub-indices/sub-indices.module';
import { IndicesClearCacheModule } from '../../dialogs/indices-clear-cache/indices-clear-cache.module';


const routes: Routes = [
  {
    path: 'node-indices',
    component: NodeIndicesComponent,
    children: [
      {
        path: 'sub-indices',
        loadChildren: () =>
          import('./sub-indices/sub-indices.module').then(
            (m) => m.SubIndicesModule
          ),
        component: SubIndicesComponent,
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
  TableModule,
  InputTextModule,
  MultiSelectModule,
  FormsModule,
  CreateIndicesModule,
  IndicesFilterModule,
  IndicesClearCacheModule,
  IndicesFlushModule,
  IndicesOptimizeModule,
  IndicesRefreshModule,
  SubIndicesModule,
  CardModule,
  MenuModule
];

const components = [NodeIndicesComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class NodeIndicesModule {}
