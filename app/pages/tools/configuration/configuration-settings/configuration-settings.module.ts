import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationSettingsComponent } from './configuration-settings.component';
import { DbSettingModule } from './db-setting/db-setting.module';
import { DbSettingComponent } from './db-setting/db-setting.component';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, BreadcrumbModule, TabMenuModule, TabViewModule, CardModule, CheckboxModule, MultiSelectModule, FieldsetModule, DropdownModule, InputTextModule, SliderModule, ConfirmDialogModule, ColorPickerModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FavouriteSettingComponent } from './favourite-setting/favourite-setting.component';
import { FavouriteSettingModule } from './favourite-setting/favourite-setting.module';
import { GraphSettingModule } from './graph-setting/graph-setting.module';
import { GraphSettingComponent } from './graph-setting/graph-setting.component';
import { GraphTreeSettingModule } from './graph-tree-setting/graph-tree-setting.module';
import { GraphTreeSettingComponent } from './graph-tree-setting/graph-tree-setting.component';
import { PercentileComponent } from './percentile/percentile.component';
import { PercentileModule } from './percentile/percentile.module';
import { QuerySettingComponent } from './query-setting/query-setting.component';
import { QuerySettingModule } from './query-setting/query-setting.module';
import { TransactionDetailsModule } from './transaction-details/transaction-details.module';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { ConfigLogsComponent } from './config-logs/config-logs.component';
import { ConfigLogsModule } from './config-logs/config-logs.module';
import { MultiNodeConfigurationComponent } from './multi-node-configuration/multi-node-configuration.component';
import { MultiNodeConfigurationModule } from './multi-node-configuration/multi-node-configuration.module';
import { FormsModule } from '@angular/forms';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  DbSettingModule,
  FavouriteSettingModule,
  GraphSettingModule,
  GraphTreeSettingModule,
  PercentileModule,
  QuerySettingModule,
  TransactionDetailsModule,
  ConfigLogsModule,
  MultiNodeConfigurationModule,
  TabViewModule,
  CardModule, 
  CheckboxModule,  
  FormsModule,    
  MultiSelectModule, 
  FieldsetModule,
  DropdownModule,
  InputTextModule,
  SliderModule,
  ConfirmDialogModule,
  ColorPickerModule
];


const components = [
  ConfigurationSettingsComponent
];

const routes: Routes = [
  {
    path: 'configuration-settings',
    component: ConfigurationSettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'logs',
        pathMatch: 'full',
      },
      {
        path: 'db-setting',
        loadChildren: () => import('./db-setting/db-setting.module').then(m => m.DbSettingModule),
        component: DbSettingComponent
      }, 
      {
        path: 'fav-setting',
        loadChildren: () => import('./favourite-setting/favourite-setting.module').then(m => m.FavouriteSettingModule),
        component: FavouriteSettingComponent
      }, 
      {
        path: 'graph-setting',
        loadChildren: () => import('./graph-setting/graph-setting.module').then(m => m.GraphSettingModule),
        component: GraphSettingComponent
      }, 
      {
        path: 'graph-tree-setting',
        loadChildren: () => import('./graph-tree-setting/graph-tree-setting.module').then(m => m.GraphTreeSettingModule),
        component: GraphTreeSettingComponent
      }, 
      {
        path: 'percentile',
        loadChildren: () => import('./percentile/percentile.module').then(m => m.PercentileModule),
        component: PercentileComponent
      },      
      {
        path: 'query-setting',
        loadChildren: () => import('./query-setting/query-setting.module').then(m => m.QuerySettingModule),
        component: QuerySettingComponent
      }, 
      {
        path: 'transaction-details',
        loadChildren: () => import('./transaction-details/transaction-details.module').then(m => m.TransactionDetailsModule),
        component: TransactionDetailsComponent
      }, 
      {
        path: 'logs',
        loadChildren: () => import('./config-logs/config-logs.module').then(m => m.ConfigLogsModule),
        component: ConfigLogsComponent
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
export class ConfigurationSettingsModule { }
