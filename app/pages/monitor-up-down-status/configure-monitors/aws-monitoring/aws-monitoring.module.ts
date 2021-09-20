import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AwsMonitoringComponent } from './aws-monitoring.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ButtonModule, CardModule, DropdownModule, PanelModule, TableModule, ToolbarModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const routes: Routes = [
  {
    path: 'aws-monitoring',
    component: AwsMonitoringComponent
  }
];

const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  PanelModule,
  DropdownModule,
  ButtonModule,
  ChartModule,
  TableModule,
  CardModule
]

@NgModule({
  declarations: [AwsMonitoringComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class AwsMonitoringModule { }
