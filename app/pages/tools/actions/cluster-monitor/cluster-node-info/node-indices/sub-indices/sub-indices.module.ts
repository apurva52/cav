import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubIndicesComponent } from './sub-indices.component';
import { Routes, RouterModule } from '@angular/router';
import {
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  TooltipModule,
  TabMenuModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IndicesAdministrationComponent } from './indices-administration/indices-administration.component';
import { IndicesAdministrationModule } from './indices-administration/indices-administration.module';
import { IndicesAliasesComponent } from './indices-aliases/indices-aliases.component';
import { IndicesAliasesModule } from './indices-aliases/indices-aliases.module';
import { IndicesMetricsComponent } from './indices-metrics/indices-metrics.component';
import { IndicesShardsComponent } from './indices-shards/indices-shards.component';
import { NodeSettingInformationModule } from '../../../dialogs/node-setting-information/node-setting-information.module';

const routes: Routes = [
  {
    path: 'sub-indices',
    component: SubIndicesComponent,
    children: [
      {
        path: '',
        redirectTo: 'indices-metrics',
        pathMatch: 'full',
      },
      {
        path: 'indices-metrics',
        loadChildren: () =>
          import('./indices-metrics/indices-metrics.module').then(
            (m) => m.IndicesMetricsModule
          ),
        component: IndicesMetricsComponent,
      },
      {
        path: 'indices-shards',
        loadChildren: () =>
          import('./indices-shards/indices-shards.module').then(
            (m) => m.IndicesShardsModule
          ),
        component: IndicesShardsComponent,
      },
      {
        path: 'indices-aliases',
        loadChildren: () =>
          import('./indices-aliases/indices-aliases.module').then(
            (m) => m.IndicesAliasesModule
          ),
        component: IndicesAliasesComponent,
      },
      {
        path: 'indices-administration',
        loadChildren: () =>
          import('./indices-administration/indices-administration.module').then(
            (m) => m.IndicesAdministrationModule
          ),
        component: IndicesAdministrationComponent,
      },
    ],
  },
];

const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  ButtonModule,
  BreadcrumbModule,
  TooltipModule,
  TabMenuModule,
  IndicesAdministrationModule,
  IndicesAliasesModule,
  NodeSettingInformationModule,
];

const components = [SubIndicesComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class SubIndicesModule {}
