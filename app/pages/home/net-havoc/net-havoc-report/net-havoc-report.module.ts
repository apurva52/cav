import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetHavocReportComponent } from './net-havoc-report.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, PanelModule, TreeTable, TreeTableModule, CarouselModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  PanelModule,
  TreeTableModule,
  ChartModule,
  CarouselModule
]

const components = [NetHavocReportComponent];

const routes: Routes = [
  {
    path: 'net-havoc-report',
    component: NetHavocReportComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetHavocReportModule { }
