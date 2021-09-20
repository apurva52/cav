import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KubernetsMonitoringComponent } from './kubernets-monitoring.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ButtonModule, CardModule, DropdownModule, PanelModule, TableModule, ToolbarModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';


const routes: Routes = [
  {
    path: 'kubernets-monitoring',
    component: KubernetsMonitoringComponent
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
  declarations: [KubernetsMonitoringComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class KubernetsMonitoringModule { }
