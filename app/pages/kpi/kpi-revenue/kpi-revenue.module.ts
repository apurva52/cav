import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KpiRevenueComponent } from './kpi-revenue.component';
import { ButtonModule, TableModule, DropdownModule, MenuModule, CardModule, MessageModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { RevenueTableComponent } from './revenue-table/revenue-table.component';


const routes: Routes = [
  {
    path: 'revenue',
    component: KpiRevenueComponent
  }
];

const component = [
  KpiRevenueComponent
];

const imports = [
  ButtonModule,
  TableModule,
  DropdownModule,
  FormsModule,
  MenuModule,
  CardModule,
  MessageModule
];

@NgModule({
  declarations: [ component, RevenueTableComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    imports
  ],
  exports: [
    RouterModule,
    component
  ]
})
export class KpiRevenueModule { }
