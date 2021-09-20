import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsVisualizationComponent } from './logs-visualization.component';
import { AddReportsComponent } from './add-reports/add-reports.component';
import { CreateVisualizationSubComponent } from './create-visualization-sub/create-visualization-sub.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { AddReportsModule } from './add-reports/add-reports.module';
import { CreateVisualizationSubModule } from './create-visualization-sub/create-visualization-sub.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  MenuModule,
  AddReportsModule,
  CreateVisualizationSubModule
];
const components = [
  LogsVisualizationComponent
];
const routes: Routes = [
  {
    path: 'logs-visualization',
    component: LogsVisualizationComponent,
    children: [
      {
        path: '',
        redirectTo: 'add-reports',
        pathMatch: 'full',
      },
      {
        path: 'add-reports',
        loadChildren: () => import('./add-reports/add-reports.module').then(m => m.AddReportsModule),
        component: AddReportsComponent
      },
      {
        path: 'create-visualization-sub',
        loadChildren: () => import('./create-visualization-sub/create-visualization-sub.module').then(m => m.CreateVisualizationSubModule),
        component: CreateVisualizationSubComponent
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
export class LogsVisualizationModule { }
