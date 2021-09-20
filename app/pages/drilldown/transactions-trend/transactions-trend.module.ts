import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsTrendComponent } from './transactions-trend.component';
import { RouterModule, Routes } from '@angular/router';
import {
  TableModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  CheckboxModule,
  DropdownModule, DialogModule, MultiSelectModule, SidebarModule, SlideMenuModule, MenuModule, TooltipModule, InputTextModule
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { LowerTabularPanelModule } from 'src/app/shared/lower-tabular-panel/lower-tabular-panel.module';
import { DrilldownFilterModule } from 'src/app/shared/drilldown-filter/drilldown-filter.module';
import { FileManagerModule } from 'src/app/shared/file-manager/file-manager.module';
import { SpecifiedTimeModule } from './specified-time/specified-time.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  MessageModule,
  CheckboxModule,
  FormsModule,
  DropdownModule,
  DrilldownFilterModule,
  LowerTabularPanelModule,
  DrilldownFilterModule,
  SidebarModule,
  DialogModule,
  SpecifiedTimeModule,
  MultiSelectModule,
  SlideMenuModule,
  MenuModule,
  LongValueModule,
  PipeModule,
  TooltipModule,
  InputTextModule,
  ChartModule
];

const components = [TransactionsTrendComponent];

const routes: Routes = [
  {
    path: 'transactions-trend',
    component: TransactionsTrendComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsTrendModule { }
