// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DDRRequestService } from './services/ddr-request.service';
import { SqlQueryService } from './services/sql-query.service';
import { RouterModule, Routes } from '@angular/router';

// BrowserXhr
import {
    CardModule, ToastModule, MessageModule, SharedModule, MessagesModule, InputSwitchModule,
    PickListModule, BreadcrumbModule, TableModule, InputTextModule, PaginatorModule, ButtonModule,
    SplitButtonModule, DialogModule, ToolbarModule, DropdownModule, TooltipModule, AccordionModule,
    BlockUIModule, MultiSelectModule, TabViewModule, ProgressBarModule, CalendarModule, RadioButtonModule,
    CheckboxModule, ContextMenuModule, TreeModule, TreeTableModule, ConfirmDialogModule, ConfirmationService,
    FieldsetModule, AutoCompleteModule, PanelModule, FileUploadModule
} from 'primeng';

import { DdrComponent } from './ddr.component';
import { CommonServices } from './services/common.services';

//Material 
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// import 'hammerjs';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { WeblogicComponent } from './components/weblogic/weblogic.component';
import { HighchartsChartModule } from 'highcharts-angular';
// import { ChartModule } from 'angular2-highcharts';
// import {NoopAnimationsModule} from '@angular/platform-browser/animations';
 import { DDR_ROUTES } from './routes/ddr.routes';
/** Routing Module */
import { DDRRoutingModule } from './routes/ddr.routes'
import { FlowpathComponent } from './components/flowpath/flowpath.component';
import { CommonComponentsModule } from '../../../app/shared/common-config-module/common.module';
import { DdrBreadCrumbComponent } from './components/ddr-bread-crumb/ddr-bread-crumb.component';
import { DdrBreadcrumbService } from './services/ddr-breadcrumb.service';
import { DdrSideViewComponent } from './components/ddr-side-view/ddr-side-view.component';
import { DdrDetailsViewComponent } from './components/ddr-details-view/ddr-details-view.component';
import { DdrPaginator } from './components/ddr-paginator/ddr-paginator.component';
import { DdrChartComponent } from './components/ddr-chart/ddr-chart.component'
import { MyAreaDirective } from './custom-directive/area-hover-directive';
import { MessageService } from './services/ddr-message.service';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { DdrSideBarComponent } from './components/ddr-side-bar/ddr-side-bar.component';
import { FlowpathGroupByComponent } from './components/flowpath-group-by/flowpath-group-by.component';
import { MethodtimingComponent } from './components/methodtiming/methodtiming.component';
import { DbGroupByComponent } from './components/db-group-by/db-group-by.component';
import { FlowpathAnalyzerComponent } from './components/flowpath-analyzer/flowpath-analyzer.component';
import { DbReportComponent } from './components/db-report/db-report.component';
import { FpToDbComponentComponent } from './components/fp-to-db-component/fp-to-db-component.component';
import { AggIpInfoComponent } from './components/agg-ip-info/agg-ip-info.component';
import { IpSummaryComponent } from './components/ip-summary/ip-summary.component';
import { ServiceMethodTimingComponent } from "./components/service-method-timing/service-method-timing.component";
import { ExceptionReportComponent } from "./components/exception-report/exception-report.component";
import { HttpReqRespComponent } from "./components/http-req-resp/http-req-resp.component";
import { HotspotComponent } from './components/hotspot/hotspot.component';
import { MethodcallingtreeComponent } from "./components/methodcallingtree/methodcallingtree.component";
import { SequenceDiagramComponent } from './components/sequence-diagram/sequence-diagram.component';
import { DdrBtTrendComponent } from './components/ddr-bt-trend/ddr-bt-trend.component';
/**
 * Compare Components 
 */
import { DdrCompareFlowpathComponent } from './components/ddr-compare-flowpath/ddr-compare-flowpath.component';
import { DdrCompareQueriesComponent } from './components/ddr-compare-queries/ddr-compare-queries.component';
import { DdrCompareMethodtimingComponent } from './components/ddr-compare-methodtiming/ddr-compare-methodtiming.component';
import { MetadataComponent } from './components/metadata/metadata.component';
import { GroupByCustomDataComponent } from './components/group-by-custom-data/group-by-custom-data.component';


/**
 * Transaction Flowmap Components & Services
 */
import { DdrAggFlowmapComponent } from './components/ddr-agg-flowmap/ddr-agg-flowmap.component';
import { DdrTransactionFlowmapComponent } from './components/ddr-transaction-flowmap/ddr-transaction-flowmap.component';
import { DdrTxnFlowmapDataService } from './services/ddr-txn-flowmap-data.service';
import { DdrTierMergeViewComponent } from './components/ddr-tier-merge-view/ddr-tier-merge-view.component';
import { DdrTransactioIndividualInfoService } from './services/ddr-transactio-individual-info.service';
import { DdrAggFlowmapService } from './services/ddr-agg-flowmap.service';
import { DdrShowRelatedGraphComponent } from './components/ddr-show-related-graph/ddr-show-related-graph.component';

/**
 * Thread Hotspot Report Components
 */
import { ThreadHotspotComponent } from "./components/thread-hotspot/thread-hotspot.component";
import { NogroupingComponent } from "./components/thread-hotspot/nogrouping/nogrouping.component";
import { GroupByAllComponent } from "./components/thread-hotspot/group-by-all/group-by-all.component";
import { GroupByCustomComponent } from "./components/thread-hotspot/group-by-custom/group-by-custom.component";

// import { QueriesComponent } from './components/queries/queries.component';
// import { ExceptionComponent } from './components/exception/exception.component';
// import { DdrIntegratedFlowpathComponent } from './components/ddr-integrated-flowpath/ddr-integrated-flowpath.component';
// import { FlowpathBySignatureComponent } from './components/flowpath-by-signature/flowpath-by-signature.component';
// import { SqlByExecutionTimeComponent } from './components/sql-by-execution-time/sql-by-execution-time.component';
// import { SqlTimingComponent } from './components/sql-timing/sql-timing.component';
import { IpStatComponent } from './components/ip-stat/ip-stat.component';
import { DdrHeaderTopNavBarComponent } from './components/ddr-header-top-nav-bar/ddr-header-top-nav-bar';

/**
 * NS Session Report Component
 */
// import { NsReportsComponent } from './components/ns-reports/ns-reports.component';
// import { NsCommonService } from './components/ns-reports/services/ns-common-service';
// import { SessionInstanceReportComponent } from './components/ns-reports/ns-session-report/session-instance-report/session-instance-report.component';
// import { NsSessionReportComponent } from './components/ns-reports/ns-session-report/ns-session-report.component';
// import { SessionFailureReportComponent } from './components/ns-reports/ns-session-report/session-failure-report/session-failure-report.component';
// import { SessionSummaryReportComponent } from './components/ns-reports/ns-session-report/session-summary-report/session-summary-report.component';
// import { SessionDetailReportComponent } from './components/ns-reports/ns-session-report/session-detail-report/session-detail-report.component';
// import { SessionTimingDetailComponent } from './components/ns-reports/ns-session-report/session-timing-detail/session-timing-detail.component';
/**
 * NS Page Report Component
 */
// import { NsPageReportComponent } from './components/ns-reports/ns-page-report/ns-page-report.component';
// import { PageSummaryReportComponent } from './components/ns-reports/ns-page-report/page-summary-report/page-summary-report.component';
// import { PageInstanceReportComponent } from './components/ns-reports/ns-page-report/page-instance-report/page-instance-report.component';
// import { PageFailureReportComponent } from './components/ns-reports/ns-page-report/page-failure-report/page-failure-report.component';
// import { PageComponentDetailsComponent } from './components/ns-reports/ns-page-report/page-component-details/page-component-details.component';
// import { PageSessionSummaryComponent } from './components/ns-reports/ns-page-report/page-session-summary/page-session-summary.component';
/**
 * NS URL Report Component
 */
// import { NsUrlReportComponent } from './components/ns-reports/ns-url-report/ns-url-report.component';
// import { UrlInstanceReportComponent } from './components/ns-reports/ns-url-report/url-instance-report/url-instance-report.component';
// import { UrlSummaryReportComponent } from './components/ns-reports/ns-url-report/url-summary-report/url-summary-report.component';
// import { UrlComponentDetailsComponent } from './components/ns-reports/ns-url-report/url-component-details/url-component-details.component';
// import { UrlFailureReportComponent } from './components/ns-reports/ns-url-report/url-failure-report/url-failure-report.component';
// import { UrlSessionSummaryComponent } from './components/ns-reports/ns-url-report/url-session-summary/url-session-summary.component';
/**
 * NS Transaction Report
 */
// import { NsTransactionReportComponent } from './components/ns-reports/ns-transaction-report/ns-transaction-report.component';
// import { TransactionInstanceReportComponent } from './components/ns-reports/ns-transaction-report/transaction-instance-report/transaction-instance-report.component';
// import { TransactionSummaryReportComponent } from './components/ns-reports/ns-transaction-report/transaction-summary-report/transaction-summary-report.component';
// import { TransactionFailureReportComponent } from './components/ns-reports/ns-transaction-report/transaction-failure-report/transaction-failure-report.component';
// import { TransactionDetailsReportComponent } from './components/ns-reports/ns-transaction-report/transaction-detail-report/transaction-details-report.component';
// import { TransactionSessionSummaryReportComponent } from './components/ns-reports/ns-transaction-report/transaction-session-summary-report/transaction-session-summary-report.component';
/**
 * user session
 */
// import { NsUsersessionsReportComponent } from './components/ns-reports/ns-usersessions-report/ns-usersessions-report.component';

/* Dynamic Diagnostics AI fron Config UI*/
// import { CommonComponentsModule } from '../../common-module/common.module';
// import { PageDumpReportComponent } from './components/page-dump-report/page-dump-report.component';
// import { PageDump } from './components/page-dump-report/pagedump/pagedump.component';
// import { PageDumpLowerFrameComponent } from './components/page-dump-report/page-dump-lower-frame/page-dump-lower-frame.component';

// import { IbmHeapDumpAnalyserComponent } from './components/ibm-heap-analyser/ibm-heap-dump-analyser.component';
// import { HeapDumpAnalyserComponent } from './components/heap-analyser/heap-dump-analyser.component';

// import { ThreadDumpAnalyseComponent } from './components/thread-dump-analyse/thread-dump-analyse.component';
// import { CompareThreadDumpComponent } from './components/compare-thread-dump/compare-thread-dump.component';
// import { TakeThreadDumpComponent } from './components/take-thread-dump/take-thread-dump.component';
// import { ThreadDumpSummaryComponent } from './components/thread-dump-summary/thread-dump-summary.component';

// import { SystemDefinedComponent } from './components/system-defined/system-defined.component';
// import { GcManagerComponent } from './components/gcManager/gcManager.component';
// import { GcViewerComponent } from './components/gcViewer/gcViewer.component';


/**
 * Also commented in A9 migrated code 
 */
// import { AppModuleForConfig } from '../../modules/nd-config/config.module';
// import { AngularSplitModule } from 'angular-split';
// import { DynamicDiagnosticsComponent } from '../../common-module/components/dynamic-diagnostics/dynamic-diagnostics.component';
// import { DDRTreeTableModule } from '../../../vendors/prime-ng/treetable/treetable';


const routes: Routes = [
    {
        path: 'ddr', component: DdrComponent,
        children: [
          { path: '', redirectTo: 'ddr', pathMatch: 'full' },
          { path: 'main', component: WeblogicComponent },
          { path: 'flowpath', component: FlowpathComponent },
          { path: 'methodtiming', component: MethodtimingComponent },
          { path: 'servicemethodtiming', component: ServiceMethodTimingComponent },
          { path: 'Flowpathgroupby', component: FlowpathGroupByComponent },
          { path: 'dbGroupBy', component: DbGroupByComponent },
          { path: 'flowpathAnalyzer', component: FlowpathAnalyzerComponent },
          { path: 'dbReport', component: DbReportComponent },
          { path: 'flowpathToDB', component: FpToDbComponentComponent },
          { path: 'ipsummary', component: IpSummaryComponent },
          { path: 'exception', component: ExceptionReportComponent },
          { path: 'httpReqResp', component: HttpReqRespComponent },
          { path: 'hotspot', component: HotspotComponent },
          { path: 'methodCallingTree', component: MethodcallingtreeComponent },
          { path: 'sequencediagram/:param', component: SequenceDiagramComponent },
          { path: 'Ddrtransactionflowpmap', component: DdrTransactionFlowmapComponent },
          { path: 'DdrAggFlowmapComponent', component: DdrAggFlowmapComponent },
          { path: 'DdrTierMergeViewComponent', component: DdrTierMergeViewComponent },
          { path: 'flowpathToMD', component: MetadataComponent },
          { path: 'DdrBtTrendComponent', component: DdrBtTrendComponent },
          { path: 'CustomDataByBTSplitting', component: GroupByCustomDataComponent },
          { path: 'threadhotspot', component: ThreadHotspotComponent },
          { path: 'nogrouping', component: NogroupingComponent },
          { path: 'allframe', component: GroupByAllComponent },
          { path: 'customdepth', component: GroupByCustomComponent },
          // { path: 'Flowpathbysignature', component: FlowpathBySignatureComponent },
          // { path: 'integratedFlowpath', component: DdrIntegratedFlowpathComponent },
          { path: 'IpStatComponent', component: IpStatComponent },
          // { path: 'sqlByExecutionTime', component: SqlByExecutionTimeComponent },
          // { path: 'sqlTiming', component: SqlTimingComponent },
          // { path: 'pagedump', component: PageDumpReportComponent },
          // { path: 'nsreports/:id', component: NsReportsComponent },
          // { path: 'heapAnalyser', component: HeapDumpAnalyserComponent },
          // { path: 'ibmheapAnalyser', component: IbmHeapDumpAnalyserComponent },
          // { path: 'view', component: TakeThreadDumpComponent },
          // { path: 'query', component: QueriesComponent },
          // { path: 'sysdef', component: SystemDefinedComponent },
          // { path: 'gcViewer', component: GcViewerComponent },
          // { path: 'gcManager', component: GcManagerComponent }
        ]
      }
  ];

@NgModule({
    imports: [
        
        //RouterModule.forChild(routes),
        //DDRRoutingModule,
        //DataTableModule,
        // BrowserModule,
        // BrowserAnimationsModule,
        // HttpClientModule,
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        SplitButtonModule,
        DialogModule,
        DropdownModule,
        RouterModule.forChild(DDR_ROUTES),
        TooltipModule,
        HighchartsChartModule,
        AccordionModule,
        BlockUIModule,
        MultiSelectModule,
        ClipboardModule,
        PaginatorModule,
        ToolbarModule,
        TabViewModule,
        InputTextModule,
        ProgressBarModule,
        CalendarModule,
        RadioButtonModule,
        CheckboxModule,
        // GrowlModule,
        // NoopAnimationsModule,
        MatSlideToggleModule, MatButtonToggleModule, MatCheckboxModule, MatButtonModule, 
        MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatInputModule, 
        MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatTableModule, 
        MatExpansionModule, MatSelectModule, MatSnackBarModule, MatTooltipModule, MatChipsModule, 
        MatListModule, MatSidenavModule, MatTabsModule, MatProgressBarModule,
        ContextMenuModule,
        TreeModule,
        BreadcrumbModule,
        TreeTableModule,
        SharedModule,
        ConfirmDialogModule,
        FieldsetModule,
        CommonComponentsModule,
        AutoCompleteModule,
        PickListModule,
        InputSwitchModule,
        PanelModule,
        // AppModuleForConfig,
        // AngularSplitModule,
        // DDRTreeTableModule,
        MessageModule,
        FileUploadModule,
        MessagesModule,
        ToastModule,
        HeaderModule,
        CardModule
    ],
    providers: [
        // NsCommonService,
        DdrTransactioIndividualInfoService,
        DdrAggFlowmapService,
        MessageService,
        DdrTxnFlowmapDataService,
        CommonServices,
        DdrBreadcrumbService,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        ConfirmationService,
        SqlQueryService,
        DDRRequestService
    ],
    declarations: [
        DdrComponent,
        WeblogicComponent,
        MyAreaDirective,
        DdrBreadCrumbComponent,
        DdrSideViewComponent,
        DdrDetailsViewComponent,
        DdrSideBarComponent,
        DdrChartComponent,
        DdrPaginator,
        FlowpathComponent,
        MethodtimingComponent,
        FlowpathGroupByComponent,
        DbGroupByComponent,
        FlowpathAnalyzerComponent,
        DbReportComponent,
        FpToDbComponentComponent,
        IpSummaryComponent,
        AggIpInfoComponent,
        ServiceMethodTimingComponent,
        ExceptionReportComponent,
        HttpReqRespComponent,
        HotspotComponent,
        MethodcallingtreeComponent,
        SequenceDiagramComponent,
        DdrAggFlowmapComponent,
        DdrTransactionFlowmapComponent,
        DdrTierMergeViewComponent,
        DdrCompareFlowpathComponent,
        DdrCompareQueriesComponent,
        DdrCompareMethodtimingComponent,
        MetadataComponent,
        DdrBtTrendComponent,
        GroupByCustomDataComponent,
        DdrShowRelatedGraphComponent,
        IpStatComponent,
        DdrHeaderTopNavBarComponent,
        ThreadHotspotComponent,
        NogroupingComponent,
        GroupByAllComponent,
        GroupByCustomComponent,
        // SystemDefinedComponent,
        // FlowpathBySignatureComponent,
        // QueriesComponent,
        // DdrIntegratedFlowpathComponent,
        // SqlByExecutionTimeComponent,
        // SqlTimingComponent,
        // GcViewerComponent,
        /**
         * NS Session
         */
        // SessionFailureReportComponent,
        // SessionDetailReportComponent,
        // SessionTimingDetailComponent,
        // NsReportsComponent,
        // NsSessionReportComponent,
        // SessionInstanceReportComponent,
        // SessionSummaryReportComponent,
        
        /**
         * NS Page
         */
        // PageSummaryReportComponent,
        // PageInstanceReportComponent,
        // PageFailureReportComponent,
        // PageComponentDetailsComponent,
        // PageSessionSummaryComponent,
        // NsPageReportComponent,

        /**
         * NS URL
         */
        // UrlSummaryReportComponent,
        // UrlInstanceReportComponent,
        // UrlComponentDetailsComponent,
        // UrlFailureReportComponent,
        // UrlSessionSummaryComponent,
        // NsUrlReportComponent,
        /**
         * NS Transaction
         */
        // TransactionInstanceReportComponent,
        // TransactionSummaryReportComponent,
        // TransactionSessionSummaryReportComponent,
        // TransactionFailureReportComponent,
        // TransactionDetailsReportComponent,
        // NsTransactionReportComponent,
        // NsUsersessionsReportComponent,

        // PageDumpReportComponent,
        // PageDump,
        // PageDumpLowerFrameComponent,
        // TakeThreadDumpComponent,
        // ThreadDumpAnalyseComponent,
        // ThreadDumpSummaryComponent,
        // CompareThreadDumpComponent,
        // HeapDumpAnalyserComponent,
        // IbmHeapDumpAnalyserComponent,
        // GcManagerComponent
    ],
    entryComponents: [
        DdrComponent
    ],
    exports: [
        DdrComponent,
    ]
})
export class DdrModule {
    constructor() {
        console.log('DDR Module')
    }
}
