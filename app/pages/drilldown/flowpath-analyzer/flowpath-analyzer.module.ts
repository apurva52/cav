import { NgModule } from '@angular/core';
import { FlowpathAnalyzerComponent } from './flowpath-analyzer.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, ButtonModule, CardModule, InputTextModule, MenuModule, MessageModule, PanelModule, SlideMenuModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';

const imports = [
  HeaderModule,
  ToolbarModule,
  CommonModule,
  PanelModule,
  TooltipModule,
  TableModule,
  ButtonModule,
  MessageModule,
  SlideMenuModule,
  FormsModule,
  CardModule,
  MenuModule,
  BreadcrumbModule,
  InputTextModule,
  ChartModule,
  PipeModule,
  LongValueModule
]

const components = [FlowpathAnalyzerComponent];

const routes: Routes = [
  {
    path: 'flowpath-analyzer',
    component: FlowpathAnalyzerComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class FlowpathAnalyzerModule { }
