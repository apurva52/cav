import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrillDownCompareFlowpathsComponent } from './drilldown-compare-flowpaths.component';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule, ProgressBarModule, ContextMenuModule, AutoCompleteModule, PaginatorModule, PickListModule, TreeTableModule, DialogModule, DropdownModule, BlockUIModule, BreadcrumbModule, ButtonModule, CardModule, ChartModule, CheckboxModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, TableModule, TabMenuModule, TabViewModule, ToastModule, ToolbarModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
// import { MethodTimingModule } from '../../dashboard-service-req/method-timing/method-timing.module';
// import { MethodTimingComponent } from '../../dashboard-service-req/method-timing/method-timing.component';
import { CompareMethodTimingModule } from "../compare-method-timing/compare-method-timing.module";
// import { CompareQueriesModule } from '../../drilldown/compare-queries/compare-queries.module';
import { CompareQueriesComponent } from "../compare-queries/compare-queries.component";
import { CompareMethodTimingComponent } from "../compare-method-timing/compare-method-timing.component";
import { HighchartsChartModule } from 'highcharts-angular';
import { ServiceMethodTimingModule } from '../compare-method-timing/service-method-timing/service-method-timing.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { MethodcallingtreeComponent } from '../methodcallingtree/methodcallingtree.component';
import { TimerService } from '../methodcallingtree/services/timer.service';
import { DynamicDiagnosticsComponent } from '../../../../shared/common-config-module/components/dynamic-diagnostics/dynamic-diagnostics.component';
import { DynamicLoggingComponent } from "../../../../shared/common-config-module/components/dynamic-logging/dynamic-logging.component";
import { CommonComponentsModule } from '../../../../shared/common-config-module/common.module';
import { CompareHotspotComponent } from "../compare-hotspot/compare-hotspot.component";
import { AggIpInfoComponent } from "../agg-ip-info/agg-ip-info.component";

const imports = [
  HeaderModule,
  CommonModule,
  ToolbarModule,
  BreadcrumbModule,
  ButtonModule,
  TableModule,
  CardModule,
  MessageModule,
  CompareMethodTimingModule,
  TabMenuModule,
  TabViewModule,
  HighchartsChartModule,
  BlockUIModule,
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AccordionModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  AccordionModule,
  PanelModule,
  ToolbarModule,
  MenuModule,
  InputTextModule,
  ServiceMethodTimingModule,
  ChartModule,
  PipeModule,
  PickListModule, 
  TreeTableModule, 
  DialogModule, 
  DropdownModule,
  PaginatorModule,
  AutoCompleteModule,
  ContextMenuModule,
  ProgressBarModule,
  CommonComponentsModule
  // CompareQueriesModule
];

const components = [DrillDownCompareFlowpathsComponent, CompareMethodTimingComponent, CompareQueriesComponent, MethodcallingtreeComponent, CompareHotspotComponent, AggIpInfoComponent];

const routes: Routes = [
  {
    path: 'drilldown-compare-flowpaths',
    component: DrillDownCompareFlowpathsComponent,
    // children: [
    //   {path: 'method-timing', component: MethodTimingComponent}
    // ]
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TimerService]
})

export class DrillDownCompareFlowpathsModule { }
