import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLibraryComponent } from './my-library.component';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { ReportsModule } from './reports/reports.module';
import { ToolbarModule, CardModule, TabViewModule, TabMenuModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { DashboardsModule } from './dashboards/dashboards.module';
import { SearchComponent } from './search/search.component';
//import { AddReportsComponent } from './reports/visualization/add-reports/add-reports.component';
//import { AddReportsModule } from './reports/visualization/add-reports/add-reports.module';
import { SearchModule } from './search/search.module';
import { AlertComponent } from './alert/alert.component';
import { AlertModule } from './alert/alert.module';
import { BusinessProcessComponent } from './business-process/business-process.component';
import { BusinessProcessModule } from './business-process/business-process.module';
import { VisualizationComponent } from './visualization/visualization.component';


const routes: Routes = [
  {
    path: 'my-library',
    component: MyLibraryComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboards',
        pathMatch: 'full',
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then(
            (m) => m.ReportsModule
          ),
        component: ReportsComponent,
      },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
        component: DashboardsComponent,
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then(
            (m) => m.SearchModule
          ),
        component: SearchComponent,
      },
   {
        path: 'visualization',
        loadChildren: () =>
          import('./visualization/visualization.module').then(
            (m) => m.VisualizationModule
          ),
        component: VisualizationComponent,
      },
      {
        path: 'alert',
        loadChildren: () =>
          import('./alert/alert.module').then(
            (m) => m.AlertModule
          ),
        component: AlertComponent,
      },
      {
        path: 'business-process',
        loadChildren: () =>
          import('./business-process/business-process.module').then(
            (m) => m.BusinessProcessModule
          ),
        component: BusinessProcessComponent,
      },
    ],
  }
];


const imports = [
  CommonModule,
  ReportsModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  TabViewModule,
  TabMenuModule,
  DashboardsModule,
  //AddReportsModule,
  SearchModule,
  AlertModule,
  BusinessProcessModule
];

const components = [
  MyLibraryComponent
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
export class MyLibraryModule { }
