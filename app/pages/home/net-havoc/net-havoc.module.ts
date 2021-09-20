import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetHavocComponent } from './net-havoc.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, InputSwitchModule, InputTextModule, MenuModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { CreateHavocComponent } from './create-havoc/create-havoc.component';
import { NetHavocReportModule } from './net-havoc-report/net-havoc-report.module';
import { NetHavocReportComponent } from './net-havoc-report/net-havoc-report.component';
import { CreateHavocModule } from './create-havoc/create-havoc.module';

const imports = [
  CommonModule,
  InputTextModule,
  TooltipModule,
  ButtonModule,
  FormsModule,
  CardModule,
  MenuModule,
  TableModule,
  InputSwitchModule,
  ChartModule,
  NetHavocReportModule,
  CreateHavocModule
];

const components = [
  NetHavocComponent
];
const routes: Routes = [
  {
    path: 'net-havoc',
    component: NetHavocComponent,  
    children: [
      {
        path: 'create-havoc',
        loadChildren: () =>
          import('./create-havoc/create-havoc.module').then(
            (m) => m.CreateHavocModule
          ),
        component: CreateHavocComponent,
      },
      {
        path: 'net-havoc-report',
        loadChildren: () =>
          import('./net-havoc-report/net-havoc-report.module').then(
            (m) => m.NetHavocReportModule
          ),
        component: NetHavocReportComponent,
      },
    ],
  }
];

@NgModule({
  declarations: [components],  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]

})
export class NetHavocModule {}
