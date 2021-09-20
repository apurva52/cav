import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiComponent } from './kpi.component';
import { Routes, RouterModule } from '@angular/router';
import { KpiGraphicalComponent } from './kpi-graphical/kpi-graphical.component';
import { KpiGraphicalModule } from './kpi-graphical/kpi-graphical.module';
import {
  ToolbarModule,
  ButtonModule,
  MenuModule,
  DropdownModule,
  CheckboxModule,
  MultiSelectModule,
  CardModule,
  TableModule,
  PanelModule,
  ToastModule,
  MessageModule,
  TooltipModule
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { KpiRevenueModule } from './kpi-revenue/kpi-revenue.module';
import { KpiTimeFilterModule } from 'src/app/shared/kpi-time-filter/kpi-time-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';


const routes: Routes = [
  {
    path: 'kpi',

    children: [
      {
        path: '',
        redirectTo: 'detailed',
        pathMatch: 'full',
      },
      {
        path: 'detailed',
        component: KpiComponent
      },
      {
        path: 'detailed/:tp',
        component: KpiComponent
      },
      {
        path: 'graphical',
        loadChildren: () =>
          import('./kpi-graphical/kpi-graphical.module').then(
            (m) => m.KpiGraphicalModule
          ),
        component: KpiGraphicalComponent,
      },
    ],
  },
];

const imports = [
  KpiGraphicalModule,
  ToolbarModule,
  ButtonModule,
  MenuModule,
  HeaderModule,
  DropdownModule,
  CheckboxModule,
  FormsModule,
  KpiRevenueModule,
  MultiSelectModule,
  CardModule,
  TableModule,
  PanelModule,
  ToastModule,
  MessageModule,
  KpiTimeFilterModule,
  TooltipModule,
  PipeModule
];

const components = [KpiComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class KpiModule { }
