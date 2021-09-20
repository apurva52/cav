import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
// import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
/** Added for Preventing 404 error while reloading */
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
// import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

// MatToolbarModule
/** Primeng Modules */
import {
  DialogModule, DropdownModule, ButtonModule, CheckboxModule, InputTextModule,
  SpinnerModule, CalendarModule, TableModule, SharedModule, ToolbarModule, TabViewModule,
  OverlayPanelModule, TooltipModule, ToastModule, MultiSelectModule, InputMaskModule, PaginatorModule,
  BlockUIModule, BreadcrumbModule, PanelModule, ConfirmDialogModule, ConfirmationService, PickListModule,
  RadioButtonModule, ContextMenuModule, FileUploadModule
} from 'primeng';
/** Component */
import { ExecDashboardMainComponent } from './exec-dashboard-main.component';
import { ExecDashboardKpiComponent } from './components/exec-dashboard-kpi/exec-dashboard-kpi.component';
import { ExecDashbaordStatsTypeComponent } from './components/exec-dashboard-kpi/exec-dashboard-statstype/exec-dashboard-statstype.component';
import { ExecDashboardMultizonedComponent } from './components/exec-dashboard-kpi/exec-dashboard-multizoned/exec-dashboard-multizoned.component';
import { ExecDashboardOrderRevenueComponent } from './components/exec-dashboard-kpi/exec-dashboard-order-revenue/exec-dashboard-order-revenue.component';
import { ExecDashboardUnzonedComponent } from './components/exec-dashboard-kpi/exec-dashboard-unzoned/exec-dashboard-unzoned.component';
import { StartEndTimeTemplateComponent } from './components/exec-dashboard-graph-time/start-end-time-template/start-end-time-template.component';
import { ExecDashboardTierStatusComponent } from './components/exec-dashboard-tier-status/exec-dashboard-tier-status.component';
import { ExecDashboardSystemStatusComponent } from './components/exec-dashboard-system-status/exec-dashboard-system-status.component';
import { TransactionScoreCardComponent } from './components/exec-dashboard-tier-status/components/tier-status-right-panel/transaction-score-card/transaction-score-card.component';
import { TierStatusHealthComponent } from './components/exec-dashboard-tier-status/components/tier-status-right-panel/tier-status-health/tier-status-health.component';
import { TierStatusAlertComponent } from './components/exec-dashboard-tier-status/components/tier-status-right-panel/tier-status-alert/tier-status-alert.component';
import { TierStatusTimePeriodComponent } from './components/exec-dashboard-tier-status/components/tier-status-time-period/tier-status-time-period.component';
import { TierStatusLeftPanelComponent } from './components/exec-dashboard-tier-status/components/tier-status-left-panel/tier-status-left-panel.component';
import { TierStatusRightPanelComponent } from './components/exec-dashboard-tier-status/components/tier-status-right-panel/tier-status-right-panel.component';
import { TierStatusLowerPanelComponent } from './components/exec-dashboard-tier-status/components/tier-status-lower-panel/tier-status-lower-panel.component';
import { TierStatusTopPanelComponent } from './components/exec-dashboard-tier-status/components/tier-status-top-panel/tier-status-top-panel.component';
import { TierStatusStartTemplateComponent } from './components/exec-dashboard-tier-status/components/tier-status-time-period/start-end-time-template/start-end-time-template.component';
import { ExecutiveDashboardTimePeriod } from './components/exec-dashboard-time-period/exec-dashboard-time-period.component';

// Varun
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { FlowmapPanelComponent } from './components/exec-dashboard-tier-status/components/tier-status-left-panel/flowmap-panel/flowmap-panel.component';
import { ActionNodeComponent } from './components/exec-dashboard-tier-status/components/tier-status-left-panel/flowmap-panel/action-node/action-node.component';
import { OutputNodeComponent } from './components/exec-dashboard-tier-status/components/tier-status-left-panel/flowmap-panel/output-node/output-node.component';
import { ControlsComponent } from './components/exec-dashboard-tier-status/components/tier-status-left-panel/flowmap-panel/controls';
import { FlowchartComponent } from './components/exec-dashboard-tier-status/components/tier-status-left-panel/flowmap-panel/flowchart/flowchart.component';

/** Services */
import { ExecDashboardCommonRequestHandler } from './services/exec-dashboard-common-request-handler.service';
import { ExecDashboardConfigService } from './services/exec-dashboard-config.service';
import { ExecDashboardCommonKPIDataservice } from './services/exec-dashboard-common-kpi-data.service';
import { ExecDashboardGraphTimeDataservice } from './services/exec-dashboard-graph-time-data.service';
import { ExecDashboardDownloadService } from './services/exec-dashboard-download.service';
import { ExecDashboardGraphicalKpiService } from './services/exec-dashboard-graphical-kpi.service';
import { ExecDashboardDataContainerService } from './services/exec-dashboard-data-container.service';
import { TierStatusDataHandlerService } from './components/exec-dashboard-tier-status/services/tier-status-data-handler.service';
import { TierStatusTimeHandlerService } from './components/exec-dashboard-tier-status/services/tier-status-time-handler.service';
import { TierStatusRightPanelService } from './components/exec-dashboard-tier-status/services/tier-status-right-panel.service';
import { TierStatusMenuHandlerService } from './components/exec-dashboard-tier-status/services/tier-status-menu-handler.service';
import { TierStatusCommonDataHandlerService } from './components/exec-dashboard-tier-status/services/tier-status-common-data-handler.service';

/** Routes */
import { EXEC_DASHBOARD_ROUTES } from './routes/exec-dashboard.routes';
import { ExecDashboardGraphTimeComponent } from './components/exec-dashboard-graph-time/exec-dashboard-graph-time.component';
import { ExecDashboardGraphicalKpiComponent } from './components/exec-dashboard-graphical-kpi/exec-dashboard-graphical-kpi.component';
import { ExecDashboardWidgetComponent } from './components/exec-dashboard-widget/exec-dashboard-widget.component';
import { ChartModule } from 'primeng/chart';
import { ExecDashboardChartProviderService } from './services/exec-dashboard-chart-provider.service';
import { ExecDashboardWidgetDataService } from './services/exec-dashboard-widget-data.service';
import { ExecDashboardSingleViewPanelComponent } from './components/exec-dashboard-graphical-kpi/exec-dashboard-single-view-panel/exec-dashboard-single-view-panel.component';
import { ExecDashboardHchartComponent } from './components/exec-dashboard-hchart/exec-dashboard-hchart.component';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
// import { HttpRequestInterceptorService } from "../../main/services/http-request-interceptor.service";

// Health Store
import { StoreHealthStatusComponent } from './components/store-health-status/store-health-status.component';
import { GeoStoreViewComponent } from './components/store-health-status/geo-store-view/geo-store-view.component';
import { AppLevelViewComponent } from './components/store-health-status/app-level-view/app-level-view.component';
import { StoreTransactionTable } from './components/store-health-status/store-transaction-table/store-transaction-table';
import { ExecDashboardStoreTransactionHandlerService } from './services/exec-dashboard-store-transaction-handler.service';

import { KeysPipe, LabelPipe } from './pipes/keysPipe';
import { ColorPipe } from './pipes/ColorPipe';
import { RoundPipe } from './pipes/roundOff';
//directives
import { ValidationDirective } from './utils/ValidationDirective';
import { CommonDialogComponent } from './components/exec-dashboard-tier-status/components/tier-status-left-panel/flowmap-panel/common-dialog/common-dialog.component';
import { ExecDashboardUtil } from './utils/exec-dashboard-util';

import {ChipsModule} from 'primeng/chips';

import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

// const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };

@NgModule({
  declarations: [
    ExecDashboardMainComponent,
    ExecDashboardKpiComponent,
    ExecDashbaordStatsTypeComponent,
    ExecDashboardMultizonedComponent,
    ExecDashboardOrderRevenueComponent,
    ExecDashboardUnzonedComponent,
    ExecDashboardGraphTimeComponent,
    StartEndTimeTemplateComponent,
    ExecDashboardTierStatusComponent,
    ExecDashboardGraphicalKpiComponent,
    ExecDashboardWidgetComponent,
    ExecDashboardSingleViewPanelComponent,
    ExecDashboardHchartComponent,
    ExecDashboardSystemStatusComponent,
    StoreHealthStatusComponent,
    GeoStoreViewComponent,
    AppLevelViewComponent,
    StoreTransactionTable,
    KeysPipe, ColorPipe, RoundPipe, LabelPipe,
    TierStatusLowerPanelComponent,
    TierStatusRightPanelComponent,
    TierStatusLeftPanelComponent,
    TierStatusTimePeriodComponent,
    TierStatusAlertComponent,
    TierStatusHealthComponent,
    TransactionScoreCardComponent,
    TierStatusTopPanelComponent,
    TierStatusStartTemplateComponent,
    // jsPlumb
    FlowmapPanelComponent,
    ActionNodeComponent,
    OutputNodeComponent,
    ControlsComponent,
    FlowchartComponent,
    ValidationDirective,
    CommonDialogComponent,
    ExecutiveDashboardTimePeriod
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(EXEC_DASHBOARD_ROUTES),
    jsPlumbToolkitModule,
    DialogModule, 
    HeaderModule,
    DropdownModule, 
    ButtonModule, 
    CheckboxModule, 
    InputTextModule, 
    SpinnerModule, 
    CalendarModule, 
    ConfirmDialogModule,
    TableModule, 
    SharedModule, 
    ToolbarModule, 
    OverlayPanelModule, 
    TooltipModule, 
    ToastModule, 
    MultiSelectModule,
    BreadcrumbModule, 
    PanelModule, 
    PickListModule, 
    TabViewModule, 
    RadioButtonModule,
    HttpClientModule, 
    ContextMenuModule,
    InputMaskModule,
    FileUploadModule,
    TableModule,
    // PerfectScrollbarModule,
    ChartModule, 
    PaginatorModule,
    BlockUIModule,
    ChipsModule,
    MessagesModule,
    MessageModule
  ],
  providers: [
    // { 
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpRequestInterceptorService,
    //   multi: true
    // },
     { provide: LocationStrategy, useClass: HashLocationStrategy },
    ExecDashboardConfigService,
    ExecDashboardCommonRequestHandler,
    ExecDashboardCommonKPIDataservice, 
    ExecDashboardGraphTimeDataservice,
    ExecDashboardDownloadService,
    ExecDashboardGraphicalKpiService, 
    ConfirmationService,
    ExecDashboardDataContainerService, 
    ExecDashboardChartProviderService,
    ExecDashboardWidgetDataService, 
    TierStatusDataHandlerService,
    TierStatusTimeHandlerService, 
    TierStatusRightPanelService,
    TierStatusMenuHandlerService, 
    TierStatusCommonDataHandlerService,
    ExecDashboardStoreTransactionHandlerService,
    ExecDashboardUtil
  ], 
  bootstrap: [ExecDashboardMainComponent],
  entryComponents: [ActionNodeComponent, OutputNodeComponent, FlowchartComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // exports: [RouterModule]
})

// @NgModule({
//   imports: [RouterModule.forChild(EXEC_DASHBOARD_ROUTES)],
//   // imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
//   })

export class ExecDashboardModule { 
  constructor() {
    console.log(' inside ExecDashboardModule');
  }
}
