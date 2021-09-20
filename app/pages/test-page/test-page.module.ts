import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestPageComponent } from './test-page.component';
import { RouterModule, Routes } from '@angular/router';
import { KpiGraphicalModule } from '../kpi/kpi-graphical/kpi-graphical.module';
import { ToolbarModule, ButtonModule, MenuModule, DropdownModule, CheckboxModule, MultiSelectModule, CardModule, TableModule, PanelModule, ToastModule, MessageModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { KpiRevenueModule } from '../kpi/kpi-revenue/kpi-revenue.module';
import { KpiTimeFilterModule } from 'src/app/shared/kpi-time-filter/kpi-time-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';


const routes: Routes = [
  {
    path: 'test-page',
    component: TestPageComponent,
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
const components = [TestPageComponent];


@NgModule({
  
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class TestPageModule { }
