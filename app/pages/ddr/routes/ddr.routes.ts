// import {Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeblogicComponent } from '../components/weblogic/weblogic.component';
import { DdrComponent } from '../ddr.component';
import { FlowpathComponent } from '../components/flowpath/flowpath.component';
import { MethodtimingComponent } from "../components/methodtiming/methodtiming.component";
import { ServiceMethodTimingComponent } from "../components/service-method-timing/service-method-timing.component";
import { FlowpathGroupByComponent } from "../components/flowpath-group-by/flowpath-group-by.component";
import { DbGroupByComponent } from '../components/db-group-by/db-group-by.component'; 
import { FlowpathAnalyzerComponent } from '../components/flowpath-analyzer/flowpath-analyzer.component';
import { DbReportComponent } from '../components/db-report/db-report.component';
import { IpSummaryComponent } from '../components/ip-summary/ip-summary.component';
import { FpToDbComponentComponent } from '../components/fp-to-db-component/fp-to-db-component.component';
import { ExceptionReportComponent } from "../components/exception-report/exception-report.component";
import { HttpReqRespComponent } from "../components/http-req-resp/http-req-resp.component"
import { HotspotComponent } from '../components/hotspot/hotspot.component';
import { MethodcallingtreeComponent } from "../components/methodcallingtree/methodcallingtree.component";
import { SequenceDiagramComponent } from '../components/sequence-diagram/sequence-diagram.component';
import { DdrAggFlowmapComponent } from '../components/ddr-agg-flowmap/ddr-agg-flowmap.component';
import { DdrTierMergeViewComponent } from '../components/ddr-tier-merge-view/ddr-tier-merge-view.component';
import { DdrTransactionFlowmapComponent } from "../components/ddr-transaction-flowmap/ddr-transaction-flowmap.component";
import { MetadataComponent } from '../components/metadata/metadata.component';
import { DdrBtTrendComponent } from '../components/ddr-bt-trend/ddr-bt-trend.component';
import { GroupByCustomDataComponent } from '../components/group-by-custom-data/group-by-custom-data.component';
import { DdrCompareFlowpathComponent } from '../components/ddr-compare-flowpath/ddr-compare-flowpath.component';

import { ThreadHotspotComponent } from "../components/thread-hotspot/thread-hotspot.component";
import { NogroupingComponent } from "../components/thread-hotspot/nogrouping/nogrouping.component";
import { GroupByAllComponent } from "../components/thread-hotspot/group-by-all/group-by-all.component";
import { GroupByCustomComponent } from "../components/thread-hotspot/group-by-custom/group-by-custom.component";
// import { FlowpathBySignatureComponent} from "../components/flowpath-by-signature/flowpath-by-signature.component";
// import { DdrIntegratedFlowpathComponent } from '../components/ddr-integrated-flowpath/ddr-integrated-flowpath.component';
import { IpStatComponent } from '../components/ip-stat/ip-stat.component'
// import { NsReportsComponent } from '../components/ns-reports/ns-reports.component';
// import { SqlByExecutionTimeComponent } from '../components/sql-by-execution-time/sql-by-execution-time.component';
// import { SqlTimingComponent } from '../components/sql-timing/sql-timing.component';
// import { PageDumpReportComponent } from '../components/page-dump-report/page-dump-report.component';
// import { TakeThreadDumpComponent } from '../components/take-thread-dump/take-thread-dump.component';
// import { QueriesComponent } from '../components/queries/queries.component';
// import { HeapDumpAnalyserComponent } from '../components/heap-analyser/heap-dump-analyser.component';
// import { SystemDefinedComponent } from '../components/system-defined/system-defined.component';
// import { GcViewerComponent } from '../components/gcViewer/gcViewer.component';
// import { IbmHeapDumpAnalyserComponent } from '../components/ibm-heap-analyser/ibm-heap-dump-analyser.component';
// import { GcManagerComponent } from '../components/gcManager/gcManager.component';

export const DDR_ROUTES: Routes = [
  {
    path: 'ddr', component: DdrComponent,
    children: [
      { path: '', redirectTo: 'ddr', pathMatch: 'full' },
      { path: 'main', component: WeblogicComponent },
      { path: 'flowpath', component: FlowpathComponent },
      { path: 'methodtiming', component: MethodtimingComponent },
      { path: 'Flowpathgroupby', component: FlowpathGroupByComponent },
      { path: 'dbGroupBy', component: DbGroupByComponent },
      { path: 'flowpathAnalyzer', component: FlowpathAnalyzerComponent },
      { path: 'dbReport', component: DbReportComponent },
      { path: 'ipsummary', component: IpSummaryComponent },
      { path: 'flowpathToDB', component: FpToDbComponentComponent },
      { path: 'servicemethodtiming', component: ServiceMethodTimingComponent },
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
      { path: 'DdrCompareFlowpath', component: DdrCompareFlowpathComponent },
      // { path: 'view', component: TakeThreadDumpComponent },
      // { path: 'query', component: QueriesComponent },
      { path: 'threadhotspot', component: ThreadHotspotComponent },
      { path: 'nogrouping', component: NogroupingComponent },
      { path: 'allframe', component: GroupByAllComponent },
      { path: 'customdepth', component: GroupByCustomComponent },
      // { path: 'Flowpathbysignature', component: FlowpathBySignatureComponent },
      // { path: 'integratedFlowpath', component: DdrIntegratedFlowpathComponent },
      { path: 'IpStatComponent', component: IpStatComponent },
      // { path: 'nsreports/:id', component: NsReportsComponent },
      // { path: 'sqlByExecutionTime', component: SqlByExecutionTimeComponent },
      // { path: 'sqlTiming', component: SqlTimingComponent },
      // { path: 'pagedump', component: PageDumpReportComponent },
      // { path: 'heapAnalyser', component: HeapDumpAnalyserComponent },
      // { path: 'ibmheapAnalyser', component: IbmHeapDumpAnalyserComponent },
      // { path: 'sysdef', component: SystemDefinedComponent },
      // { path: 'gcViewer', component: GcViewerComponent },
      // { path: 'gcManager', component: GcManagerComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(DDR_ROUTES)],
  // imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DDRRoutingModule {

}
