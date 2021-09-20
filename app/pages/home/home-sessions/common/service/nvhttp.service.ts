import { Observable, Subject, forkJoin } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import 'moment-timezone';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { ParsePageFilter } from '../../page-filter/sidebar/page-filter-sidebar/service/ParsePageFilter';
import { SessionService } from 'src/app/core/session/session.service';
import { Util } from '../util/util';


export class NVPreLoadedState<T> extends Store.AbstractIdealState<T> { }
export class NVPreLoadingState<T> extends Store.AbstractLoadingState<T> { }
export class NVPreLoadingErrorState<T> extends Store.AbstractErrorState<T> { }

@Injectable({ providedIn: 'root' })
// this will be just interface that will further use controller class
export class NvhttpService extends Store.AbstractService {

  constructor(private http: HttpClient, private sessionService: SessionService) {
    super();
  }

  static apiUrls: any = {
    authenticate: 'netvision/rest/webapi/nvAppConfigServiceAuth?strOperName=authenticate&access_token=563e412ab7f5a282c15ae5de1732bfd1' + '&sesLoginName=' + sessionStorage.getItem('sesLoginName'),
    config: 'netvision/rest/webapi/nvAppConfigService?strOperName=getAppConfigurations&access_token=563e412ab7f5a282c15ae5de1732bfd1&isAdminUser=' + localStorage.getItem('isAdminUser'),
    metadata: 'netvision/rest/webapi/metadata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    session: 'netvision/rest/webapi/sessionfilter?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    nfLink: 'netvision/rest/webapi/nvAppConfigServicenfopen?strOperName=openNF&access_token=563e412ab7f5a282c15ae5de1732bfd1' + '&sesLoginName=' + sessionStorage.getItem('sesLoginName'),
    similarsessions: 'netvision/rest/webapi/similarsessions?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    // 'similarsessions': 'netvision/reports/samplesessions',
    page: 'netvision/rest/webapi/pagedetail?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    ndLink: 'netvision/rest/webapi/nvAppConfigServicendopen?strOperName=FPByFPI&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    activeSession: 'netvision/rest/webapi/activesessions?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    activeSessioncount: 'netvision/rest/webapi/activesessioncount?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    activePages: 'netvision/rest/webapi/activepages?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    // page level urls
    customMetrics: 'netvision/rest/webapi/nvcustommetrics?strOperName=custommetric&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    jserror: 'netvision/rest/webapi/nvgetjserrors?access_token=563e412ab7f5a282c15ae5de1732bfd1&opname=getjserrors',
    userTimings: 'netvision/rest/webapi/getUTDataSession?opname=getUTDataSession&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    ajaxRequests: 'netvision/rest/webapi/nvgetAjaxdata?strOperName=getAjaxdata&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    userActions: 'netvision/rest/webapi/nvgetuserActions?strOperName=getUserActionSession&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    aggregateData: 'netvision/rest/webapi/nvaggregateData?strOperName=aggregatedata&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    pagedump: 'netvision/rest/webapi/nvsnapshotpagedump?strOperName=getSnapShotPath&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    resourceTiming: 'netvision/rest/webapi/nvresourceTiming?strOperName=HarForPage&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    events: 'netvision/rest/webapi/eventsdata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    getFile: 'netvision/rest/webapi/nvgetjsfile?opname=getjsfile&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    // 'domainAggData' : 'netvision/reports/domaindata',
    domainAggData: 'netvision/rest/webapi/domainAggData?strOperName=aggregateDomain&access_token=563e412ab7f5a282c15ae5de1732bfd1', // &filterCriteria={"timeFilter":{"startTime":"11/08/2017 00:00:00","endTime":"11/08/2017 11:59:59 "}}',
    domainTrend: 'netvision/rest/webapi/domainTrend?strOperName=domainTrend&access_token=563e412ab7f5a282c15ae5de1732bfd1', // &filterCriteria={%22timeFilter%22:{%22startTime%22:%2211/07/2017%2009:00:00%22,%22endTime%22:%2211/08/2017%2009:59:59%20%22},%22domainName%22:%22www.google.com%22}',
    alldomainTrend: 'netvision/rest/webapi/alldomainTrend?strOperName=multiDomainTrend&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    // 'allresourceTrend' : 'netvision/reports/allres?',
    allresourceTrend: 'netvision/rest/webapi/allresourceTrend?strOperName=multiResourceTrend&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    pageperformance: 'netvision/rest/webapi/pageperformance?strOperName=aggregatePage&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    pageperformancetrend: 'netvision/rest/webapi/pageperformancetrend?strOperName=pageTrend&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    aggregateResource: 'netvision/rest/webapi/aggregateResource?strOperName=aggregateResource&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    rumdata: 'netvision/rest/webapi/getrumdata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    eventAggData: 'netvision/rest/webapi/eventAggData?strOprName=eventAgg&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    eventAggAttribute: 'netvision/rest/webapi/eventAggData?strOprName=eventAttribute&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    testScript: 'netvision/rest/webapi/nvscriptmanager',
    dataService: 'netvision/rest/webapi/dataServicepage?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    dataServicecount: 'netvision/rest/webapi/dataServicepagecount?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    // 'revenuetable' :'netvision/reports/nvRevenueDataStats.jsp?filterCriteria={"timeFilter":{"last":"","startTime":"12/19/2017%2023:30:00","endTime":"12/20/2017%2023:30:00"},"bucket":3600,"pageName":"a","pagePerformanceFilter":"onload","channels":"1","granularity":"0.1"}&chkflag=pageRevenueList',
    // 'revenuetable' :'netvision/reports/r1?flag=ss',
    // 'revenuegraph' :'netvision/reports/r2?flag=ss',
    // 'revenuegraph' :'netvision/reports/nvRevenueDataStats.jsp?filterCriteria={"timeFilter":{"last":"","startTime":"12/19/2017%2023:30:00","endTime":"12/20/2017%2023:30:00"},"bucket":3600,"pages":"1","pageName":"a","pagePerformanceFilter":"onload","channels":"1","granularity":"0.1"}&chkflag=pagePerformanceFilter',
    // 'optimizedgraph' :'netvision/reports/r3?flag=ss',
    // 'improvedgraph' :'netvision/reports/r4?flag=ss'
    // 'improvedgraph' :'netvision/reports/nvRevenueDataStats.jsp?filterCriteria={"timeFilter":{"last":"","startTime":"12/19/2017%2023:30:00","endTime":"12/20/2017%2023:30:00"},"bucket":3600,"pages":"1","pageName":"a","pagePerformanceFilter":"onload","channels":"1","granularity":"0.1"}&chkflag=pageDetailImprovement',
    revenuetable: 'netvision/rest/webapi/nvrevenuedatastat?chkflag=pageRevenueList&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    revenuegraph: 'netvision/rest/webapi/nvrevenuedatastat?chkflag=pagePerformanceFilter&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    optimizedgraph: 'netvision/rest/webapi/nvrevenuedatastat?chkflag=pageDetailOptimization&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    improvedgraph: 'netvision/rest/webapi/nvrevenuedatastat?chkflag=pageDetailImprovement&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    revenueOpporunity: 'netvision/rest/webapi/nvrevenuedatastat?chkflag=annualRevenue&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    rawAjaxRequests: 'netvision/rest/webapi/httpRequestData?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    rawAggAjaxRequests: 'netvision/rest/webapi/httpAggRequestData?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    navigationpath: 'netvision/rest/webapi/navigationpathanalysis?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    transactionpath: 'netvision/rest/webapi/transactions?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    viewpath: 'netvision/rest/webapi/viewpathanalysis?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    reportData: 'netvision/reports/templateReportConfig.json',
    templateBuilder: 'netvision/rest/webapi/nvspecialreport?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    jsError: 'netvision/rest/webapi/jserrors?&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    jsErrorDetails: 'netvision/rest/webapi/jserrorsDetails?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    jsErrData: 'netvision/rest/webapi/container?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    special: 'netvision/rest/webapi/nvspecialreport?strOprName=report&access_token=563e412ab7f5a282c15ae5de1732bfd1',
    validateaggsession: 'netvision/rest/webapi/botaggregatedata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    validatedetailsession: 'netvision/rest/webapi/botdetaildata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addNewVariation: 'netvision/rest/webapi/newvariation?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updateVariation: 'netvision/rest/webapi/updatevariation?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showVariation: 'netvision/rest/webapi/getVariationList?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showABVariation: 'netvision/rest/webapi/getABVariationList?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showNonABVariation: 'netvision/rest/webapi/getNonABVariationList?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteVariation: 'netvision/rest/webapi/deleteVariations?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    appsessiondata: 'netvision/rest/webapi/applicationView?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    appname: 'netvision/rest/webapi/applicationName?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addgoal: 'netvision/rest/webapi/addgoal?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deletegoals: 'netvision/rest/webapi/deletegoals?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showgoals: 'netvision/rest/webapi/showgoals?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updategoal: 'netvision/rest/webapi/updategoal?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    exportReport: '/reports/controller/nvDownLoadReportHandlerTest.jsp?',
    ViewCrash: 'netvision/rest/webapi/crashprequestpage?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    AggregateCrash: 'netvision/rest/webapi/aggregatecrash?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addevent: 'netvision/rest/webapi/addevent?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showEvents: 'netvision/rest/webapi/showevents?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteEvent: 'netvision/rest/webapi/deleteEvents?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updateEvent: 'netvision/rest/webapi/updateEvents?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addpage: 'netvision/rest/webapi/addpage?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showPage: 'netvision/rest/webapi/showpage?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deletePage: 'netvision/rest/webapi/deletepage?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updatePage: 'netvision/rest/webapi/updatePage?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addcustom: 'netvision/rest/webapi/addcustom?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showcustom: 'netvision/rest/webapi/showcustom?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteCustom: 'netvision/rest/webapi/deleteCustom?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updateCustom: 'netvision/rest/webapi/updateCustom?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addusersegment: 'netvision/rest/webapi/addusersegment?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addrulesusersegment: 'netvision/rest/webapi/addrulesusersegment?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showUserSegment: 'netvision/rest/webapi/showUserSegment?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showUserSegmentRule: 'netvision/rest/webapi/showUserSegmentRule?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteUserSegment: 'netvision/rest/webapi/deleteUserSegment?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updateUserSegment: 'netvision/rest/webapi/updateUserSegment?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteruleUserSegment: 'netvision/rest/webapi/deleteruleUserSegment?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addupdaterulesusersegment: 'netvision/rest/webapi/addupdaterulesusersegment?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addcheckpoint: 'netvision/rest/webapi/addcheckpoint?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showcheckpoint: 'netvision/rest/webapi/showcheckpoint?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteCheckPoint: 'netvision/rest/webapi/deletecheckpoint?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updateCheckPoint: 'netvision/rest/webapi/updateCheckPoint?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addchannel: 'netvision/rest/webapi/addchannel?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showchannel: 'netvision/rest/webapi/showchannel?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteChannel: 'netvision/rest/webapi/deletechannel?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updateChannel: 'netvision/rest/webapi/updateChannel?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    selectedCRQ: 'netvision/reports/nvCustomQueryHanlder.jsp?',
    selectedCRQFilters: 'netvision/reports/nvCustomReportMetaData.jsp?',
    deleteReports: 'netvision/reports/nvCustomQueryHanlder.jsp?',
    addanotherrulesusersegment: 'netvision/rest/webapi/addanotherrulesusersegment?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addBusinessProcess: 'netvision/rest/webapi/addBusinessProcess?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showBusinessData: 'netvision/rest/webapi/showbusinessdata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteBPData: 'netvision/rest/webapi/deleteBpData?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    UpdateBusinessProcess: 'netvision/rest/webapi/updatebusinessprocess?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    SaveFlowChart: 'netvision/rest/webapi/saveflowchart?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    crashtabinfo: 'netvision/rest/webapi/CrashTabView?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    saveCustomReport: 'netvision/reports/nvCustomQueryHanlder.jsp?requestString=writeCRQFile',
    feedbackFilter: 'netvision/rest/webapi/feedbackFilter?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    feedbackPageDump: 'netvision/rest/webapi/nvfeedbacksnapshot?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showMarketGraph: 'netvision/rest/webapi/marketgraph?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    campaignData: 'netvision/rest/webapi/campaignData?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    campaignGraph: 'netvision/rest/webapi/campaignDetailGraph?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    AddNewProfile: 'netvision/rest/webapi/newAgentProfile?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    getconfig: 'netvision/rest/webapi/getagentprofile?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showFileList: 'netvision/rest/webapi/getProfileRevesions?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showAgentDBData: 'netvision/rest/webapi/getAgentProfiles?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deleteCardData: 'netvision/rest/webapi/deleteagentprofile?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    UpdateAgentProfile: 'netvision/rest/webapi/updateagentprofile?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    UpdateAgentProfileReplay: 'netvision/rest/webapi/updateagentprofilereplay?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    UpdateAgentMetadata: 'netvision/rest/webapi/Updateagentmetadata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    hpdrestart: 'netvision/rest/webapi/applyChanges?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    replaypagedata: 'netvision/rest/webapi/replaypagedata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    androidpagedata: 'netvision/rest/webapi/replayandroidImage?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    datareq: 'netvision/rest/webapi/nvreplaysession?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    replayjsondata: 'netvision/reports/nvUserActionRecordNew.jsp?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    UpdateRumData: 'netvision/rest/webapi/postconfigui?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showRumData: 'netvision/rest/webapi/getconfigui?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    rumhpdactivate: 'netvision/rest/webapi/applyRumChanges?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showpendingRumData: 'netvision/rest/webapi/getpendingrumkeywords?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    UpdatePendingKeywords: 'netvision/rest/webapi/postpendingkeywords?access_token=563e412ab7f5a282c15ae5de1732bfd1',

    callbacks: 'netvision/rest/webapi/getcallbacks?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addcallback: 'netvision/rest/webapi/addCallback?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updatecallback: 'netvision/rest/webapi/updateCallback?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    deletecallback: 'netvision/rest/webapi/deleteCallback?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    callbackVersions: 'netvision/rest/webapi/getCallbackVersions?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updateCallbackVersion: 'netvision/rest/webapi/updateCallbackVersion?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updateCallbackVersionName: 'netvision/rest/webapi/updateCallbackVersionName?access_token=563e412ab7f5a282c15ae5de1732bfd1',

    attentionMap: 'netvision/rest/webapi/nvattentionMap?access_token=563e412ab7f5a282c15ae5de1732bfd1&strOperName=attentionheatmap',
    heatMap: 'netvision/rest/webapi/nvheatmapforpage?access_token=563e412ab7f5a282c15ae5de1732bfd1&strOperationName=heatmapforpage',
    getfiledata: 'netvision/rest/webapi/getFileData?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    saveBackCleanData: 'netvision/rest/webapi/savebackupcleanupfiledata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    analyticalforms: 'netvision/reports/nvFormAnalyticsController.jsp?access_token=563e412ab7f5a282c15ae5de1732bfd1&strOperName=overallform',
    saveNavigationImageTOServer: 'netvision/reports/saveNavigationImageTOServer.jsp?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    devicePerformance: 'netvision/rest/webapi/deviceperformance?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    cm: 'netvision/rest/webapi/customMetrics?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    methodtrace: 'netvision/rest/webapi/methodtrace?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showDiskData: 'netvision/rest/webapi/disksummarydata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showMultiDiskData: 'netvision/rest/webapi/getconfiguimultidisk?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    SaveDiskAllocationData: 'netvision/rest/webapi/postdiskallocation?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    getSlaveList: 'netvision/rest/webapi/slavenodename?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    appNameandVersion: 'netvision/rest/webapi/getAppNameandVersion?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    generateToken: '/DashboardServer/web/commons/generateToken',
    getProductUIDetails: 'ProductUI/productSummary/SummaryWebService/getProductName?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    authenticateUser: '/DashboardServer/acl/user/authenticateUser',
    parsers: 'netvision/rest/webapi/getparsers?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    addparser: 'netvision/rest/webapi/addparser?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    UpdateParserTableAllocation: 'netvision/rest/webapi/postparsertablespace?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    writeColumns: 'netvision/rest/webapi/writeColumns?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    updatecrashtabinfo: 'netvision/rest/webapi/updateCrashRawData?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    templateReportList: 'netvision/rest/webapi/adhocreportlist?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    templateReportDetails: 'netvision/rest/webapi/adhocreportjson?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    eventImpactInfo: 'netvision/rest/webapi/getEventImpactInfo?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    eventImpactInfoTSDB: 'netvision/rest/webapi/getTsdbEventImpactInfo?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showpagebaselinedata: 'netvision/rest/webapi/pageBaseline?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    postbaselinedata: 'netvision/rest/webapi/pageBaseline?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    showdomainbaselinedata: 'netvision/rest/webapi/domainBaseline?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    generatebaslinedata: 'netvision/rest/webapi/baseline?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    postdomainbaselinedata: 'netvision/rest/webapi/domainBaseline?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    checkstatusbaseline: 'netvision/rest/webapi/statusBaseline?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    lptabledata: 'netvision/rest/webapi/lptabledata?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    startParser: 'netvision/rest/webapi/startStandaloneParser?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    mapParserInfo: 'netvision/rest/webapi/fillParserInfo?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    getMapParserInfo: 'netvision/rest/webapi/getParserInfo?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    formAnalyticsFormName: 'netvision/rest/webapi/formanalyticsformnamemap?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    formAnalyticsPageName: 'netvision/rest/webapi/formanalyticspagenamemap?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    formAnalayticsReport: 'netvision/rest/webapi/formanalyticsreport?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    httpScatteredChart: 'netvision/rest/webapi/gethttpScatteredChartData?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    crashTabViewExport: '/netvision/rest/webapi/CrashTabViewExport?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    exportProfiler: 'netvision/rest/webapi/exportProfiler?access_token=563e412ab7f5a282c15ae5de1732bfd1',
    TerminalId: 'netvision/rest/webapi/showterminalid?'
  };


  // for testing set machine ip,port,protocol
  // base = 'https://10.20.0.65:8443/';
  nvDC: any = null;
  // for testing set machine ip,port,protocol 
  base = environment.api.netvision.base.base;
  ip = '';
  port = '';
  protocol = '';
  // TODO: Move this in a seperate file and add as provider.
  getRequestUrl(path) {
    //path = path.replace('access_token=563e412ab7f5a282c15ae5de1732bfd1', 'productKey=' + (localStorage.getItem('productKey') || sessionStorage.getItem('productKey') || localStorage.getItem('replayProductKey') || sessionStorage.getItem('replayProductKey')));
    return path;
  }

  get<T>(path: string, postdata?: string): Observable<Store.State> {
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new NVPreLoadingState());
    }, 0);

    this.controller.get(path, postdata, this.base).subscribe((data: T) => {
      output.next(new NVPreLoadedState(data));
      output.complete();
    },
      (e: any) => {
        output.error(new NVPreLoadingErrorState(e));
        output.complete();

      });
    return output;
  }

  post<T>(path: string, postdata: any | null, options?: any) {
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new NVPreLoadingState());
    }, 0);

    this.controller.post(path, postdata, this.base, options).subscribe((data: T) => {
      output.next(new NVPreLoadedState(data));
      output.complete();
    },
      (e: any) => {
        output.error(new NVPreLoadingErrorState(e));
        output.complete();

      });
    return output;
  }

  put<T>(path: string, postdata: string) {
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new NVPreLoadingState());
    }, 0);

    this.controller.put(path, postdata, this.base).subscribe((data: T) => {
      output.next(new NVPreLoadedState(data));
      output.complete();
    },
      (e: any) => {
        output.error(new NVPreLoadingErrorState(e));
        output.complete();

      });
    return output;
  }

  // Note: url should be asolute without host i.e. start with /.
  getJspUrl(url: any) {
    // Check if multi dc mode then.
    const nvdc = this.getNVDC();
    if (nvdc == null) { return url; }

    // first hit nvURIRedirection.
    const sesLoginName = sessionStorage.getItem('sesLoginName');
    const sessGroupName = sessionStorage.getItem('sessGroupName');
    const sessUserType = sessionStorage.getItem('sessUserType');
    const sessServerTitle = sessionStorage.getItem('sessServerTitle');
    const strServerType = sessionStorage.getItem('strServerType');
    const sesRole = sessionStorage.getItem('sesRole');
    const sesLoginPass = sessionStorage.getItem('sesLoginPass');
    const productType = sessionStorage.getItem('productType');
    const sessServerCheck = sessionStorage.getItem('sessServerCheck');
    const controllerInfo = sessionStorage.getItem('controllerInfo');
    const ContinuousMode = sessionStorage.getItem('ContinuousMode');

    // let nvPath = nvdc.protocol + '://' + nvdc.ip + ':' + nvdc.port + '/';
    // Check if jspurl.host is set or not.
    let NV_JSP_URLHOST = sessionStorage.getItem('NV_JSP_URLHOST');
    let nvPath;
    /*if (!NV_JSP_URLHOST) {
      console.log("NV_JSP_URLHOST is not set in nv ");
      if (AppComponent.config.jspurlhost !== "") {
        //sessionStorage.setItem('NV_JSP_URLHOST', AppComponent.config.jspurlhost);
        NV_JSP_URLHOST = sessionStorage.getItem('NV_JSP_URLHOST');
      }
      else {
      */
    console.warn('AppComponent.config.jspurlhost not set in appConfig.using default value - nv');
    sessionStorage.setItem('NV_JSP_URLHOST', 'nv');
    NV_JSP_URLHOST = sessionStorage.getItem('NV_JSP_URLHOST');
    // }
    // }
    if (NV_JSP_URLHOST === 'nv') {
      nvPath = nvdc.protocol + '://' + nvdc.ip + ':' + nvdc.port + '/';
    }
    else if (NV_JSP_URLHOST === 'ui') {
      nvPath = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/';
    } else {
      nvPath = NV_JSP_URLHOST;
    }

    const encodeurl = encodeURIComponent(url);
    console.log('encodeurl == ' + encodeurl);
    return nvPath + 'netvision/reports/nvProductUIredirection.jsp?redirectURL=' + encodeurl + '&sesLoginName='
      + sesLoginName + '&sessGroupName=' + sessGroupName + '&sessUserType=' + sessUserType +
      '&sessServerTitle=' + sessServerTitle + '&strServerType=' + strServerType +
      '&sesRole=' + sesRole + '&sesLoginPass=' + sesLoginPass +
      '&productType=' + productType + '&sessServerCheck=' + sessServerCheck +
      '&controllerInfo=' + controllerInfo + '&ContinuousMode=' + ContinuousMode + '&isFromDashboard=true';

    // return nvdc.protocol + '://' + nvdc.ip + ':' + nvdc.port + url;
  }

  exportHttpdata(filter: any, filterString: any, exporttype: any) {
    filter.pageCount = false;
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    let url = this.getRequestUrl('netvision/rest/webapi/exportHttpData?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterCriteria=' + JSON.stringify(filter);
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    window.open(url + '&filterString=' + filterString + '&exporttype=' + exporttype + '&timezoneflag=' + timezoneflag);
  }

  exporttransaction(filter: any, filterString: any, exporttype: any) {
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    let url = this.getRequestUrl('netvision/rest/webapi/exporttransactions?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterCriteria=' + JSON.stringify(filter);
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    window.open(url + '&filterString=' + filterString + '&exporttype=' + exporttype + '&timezoneflag=' + timezoneflag);
  }

  getNFLink(sessionId, pageinstance, flowpathid, startTime, endTime, urlParam, type) {
    // for session
    const ndST = (Number(startTime) - 300) * 1000;
    const ndET = (Number(endTime) + 1800) * 1000;
    const st = new Date(ndST);
    const et = new Date(ndET);

    // change timing in iso format
    const st1 = st.toISOString();
    const et1 = et.toISOString();


    let serviceURL;
    if (sessionStorage.getItem('isMultiDCMode') != 'true') {
      serviceURL = this.getRequestUrl(NvhttpService.apiUrls.nfLink) + '&startTime=' + st1 + '&endTime=' + et1 + '&nvSessionId=' + sessionId + '&pageinstance=' + pageinstance + '&flowpathid=' + flowpathid + '&url=' + urlParam + '&requestType=' + type;
    } else {
      // In case of multidc. Directly request to NV Server because node server does not support redirection.
      const nvdc = this.getNVDC();
      serviceURL = this.getJspUrl(NvhttpService.apiUrls.nfLink + '&startTime=' + st1 + '&endTime=' + et1 + '&nvSessionId=' + sessionId + '&pageinstance=' + pageinstance + '&flowpathid=' + flowpathid + '&url=' + urlParam + '&requestType=' + type);
    }

    console.log('NF Redirection URL - ', serviceURL);

    window.open(serviceURL);
  }

  getSimilarSessions(filter: any): Observable<any> {
    let serviceUrl = '';
    serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.similarsessions);
    serviceUrl += `&filterCriteria=` + encodeURIComponent(JSON.stringify(filter));
    console.log('getSimilarSessions : ', serviceUrl);
    return this.get(serviceUrl);
  }

  postSimilarSessions(filter: any): Observable<any> {
    let serviceUrl = '';
    serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.similarsessions);
    console.log('getSimilarSessions : ', serviceUrl);
    return this.post(serviceUrl, filter);
  }


  getSessions(filter: any, active: boolean): Observable<any> {
    console.log('@filter ', filter);
    let serviceUrl = '';
    if (active === false) {
      if (filter.sessionCount === false) {
        if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
          const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
          const dateObj = new Date(filter.timeFilter.startTime + offset);
          filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
          const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
          const dateObjj = new Date(filter.timeFilter.endTime + offsett);
          filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
        }
      }
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.session);
      serviceUrl += `&filterCriteria=` + encodeURIComponent(JSON.stringify(filter));
    }
    else {
      const args = {};
      if (filter.clientip !== null) {
        args['clientIP'] = filter.clientip;
      }
      if (filter.loginid !== null) {
        args['loginId'] = filter.loginid;
      }
      if (filter.nvSessionId !== null) {
        args['sid'] = filter.nvSessionId;
      }
      if (filter.storeFilter != undefined && filter.storeFilter != null && filter.storeFilter.storeId != -2 && filter.storeFilter.storeId != -1) {
        args['storeid'] = filter.storeFilter.storeId;
        if (filter.storeFilter.terminalId != null && filter.storeFilter.terminalId != -1) {
          args['terminalId'] = filter.storeFilter.terminalId;
        }
      }
      if (filter.storeFilter != undefined && filter.storeFilter != null && filter.storeFilter.transactionId != undefined && filter.storeFilter.transactionId != -1) {
        args['transactionid'] = filter.storeFilter.transactionId;
      }
      if (filter.sessionsWithSpecificEvents != undefined && filter.sessionsWithSpecificEvents != null) {
        args['eventIdList'] = filter.sessionsWithSpecificEvents;
      }

      // limit=100&offset=0&channel=-1&opcode=data&access_token=563e412ab7f5a282c15ae5de1732bfd1&filterCriteria={}
      if (filter.sessionCount === true) {
        serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.activeSessioncount) + '&offset=' + filter.offset + '&limit=' + filter.limit + '&channel=' + filter.channel + '&opcode=count&filterCriteria=' + encodeURIComponent(JSON.stringify(args));
      }
      else {
        serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.activeSession) + '&offset=' + filter.offset + '&limit=' + filter.limit + '&channel=' + filter.channel + '&opcode=data&filterCriteria=' + encodeURIComponent(JSON.stringify(args));
      }
    }

    // make the post call.
    return this.get(serviceUrl);
  }

  getPages(ref): Observable<any> {
    let serviceUrl = '';
    console.log('ref --', ref);
    if (ref.activeSession === false) {
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.page);
      // make the post call
      serviceUrl += `&filterCriteria=` + encodeURIComponent(JSON.stringify(ref.session));
    }
    else {
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.activePages) + '&limit=100&channel=-1&opcode=data&filterCriteria=' + encodeURIComponent(JSON.stringify({ sid: ref.session.sid }));
    }
    return this.get(serviceUrl);
  }

  getResponseFromRedirectURL(redirectUrl): Observable<Store.State> {
    return this.get(redirectUrl);
  }


  getHttpRequests(sid, pageInstance, duration) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.ajaxRequests);
    serviceUrl += `&nvSessionId=` + sid + `&pageinstance=` + pageInstance + `&duration=` + duration;
    return this.get(serviceUrl);
  }

  getAggXhrRequests(filter: any) {
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }

    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.rawAggAjaxRequests);
    serviceUrl += `&filterCriteria=` + JSON.stringify(filter);
    // let tempUrl = `http://127.0.0.1:81/httpreq`;
    return this.get(serviceUrl);

  }
  getXhrRequests(filter: any) {
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.rawAjaxRequests);
    serviceUrl += `&filterCriteria=` + JSON.stringify(filter);
    // let tempUrl = `http://127.0.0.1:81/httpreq`;
    return this.get(serviceUrl);
  }

  getJSError(filter: any) {
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }

    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.jsError);
    serviceUrl += `&filterCriteria=` + encodeURIComponent(JSON.stringify(filter));
    // let tempUrl = `http://127.0.0.1:81/httpreq`;
    return this.get(serviceUrl);
  }

  getJSErrorDetails(filter: any) {
    filter.timeFilter = { ...filter.timeFilter };
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      filter.timeFilter.startTime = Util.convertLocalTimeZoeToUTC(filter.timeFilter.startTime);
      filter.timeFilter.endTime = Util.convertLocalTimeZoeToUTC(filter.timeFilter.endTime);
    }

    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.jsErrorDetails);
    serviceUrl += `&filterCriteria=` + encodeURIComponent(JSON.stringify(filter));
    // let tempUrl = `http://127.0.0.1:81/httpreq`;
    return this.get(serviceUrl);
  }

  getJSErrors(filter: any) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.jsErrData);
    serviceUrl += `&filterCriteria=` + JSON.stringify(filter);
    // let tempUrl = `http://127.0.0.1:81/httpreq`;
    return this.get(serviceUrl);
  }

  getCustomMetrics(sid, pageInstance, startTime, endTime) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.customMetrics);
    pageInstance = pageInstance || -1;
    serviceUrl += `&nvSessionId=` + sid + `&pageinstance=` + pageInstance + '&startTime=' + startTime + '&endTime=' + (parseInt(endTime) + 7200);
    return this.get(serviceUrl);
  }

  // page specific services

  getJSErrorData(sid, pageInstance, duration) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.jserror);
    serviceUrl += `&nvSessionId=` + sid + `&pageinstance=` + pageInstance + '&duration=' + duration;
    return this.get(serviceUrl);
  }

  getUserTiming(sid, pageInstance, duration) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.userTimings);
    serviceUrl += `&nvSessionId=` + sid + `&pageinstance=` + pageInstance + '&duration=' + duration;
    return this.get(serviceUrl);
  }

  getAjaxData(sid, pageInstance, duration) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.ajaxRequests);
    serviceUrl += `&nvSessionId=` + sid + `&pageinstance=` + pageInstance + '&duration=' + duration;
    return this.get(serviceUrl);
  }

  getUserActionData(sid, pageInstance, duration, eventtype) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.userActions);
    serviceUrl += `&nvSessionId=` + sid + `&pageinstance=` + pageInstance + '&duration=' + duration + '&eventname=' + eventtype;
    return this.get(serviceUrl);
  }

  getAggregateData(sid, pageinstance) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.aggregateData);
    serviceUrl += `&nvSessionId=` + sid + `&pageinstance=` + pageinstance;
    return this.get(serviceUrl);
  }

  getSnapShotPathThroughAjax(index, sessionStartTime, sid, pageInstance, partitionID, snapshotid) {

    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.pagedump);
    let currentpageindex = index;
    serviceUrl += "&startTime=" + sessionStartTime +
      "&nvSessionId=" + sid +
      "&pageinstance=" + pageInstance +
      "&index=" + index +
      "&partitionId=" + partitionID +
      "&currentPage=" + currentpageindex +
      "&snapshotid=" + snapshotid;
    //return this.get(serviceUrl,"");
    return this.http.get(this.base + serviceUrl, { responseType: 'text' }).pipe(map((response: any) => response));
    //return this.get(serviceUrl, { responseType: 'text' },"");//response: any) => response);
  }

  getResourceTimings(sid, pageInstance, onLoad, domContentLoaded, navigationStartTime, pageName) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.resourceTiming);
    serviceUrl += `&nvSessionId=` + sid
      + `&pageinstance=` + pageInstance
      + '&index=' + onLoad
      + '&DOMComplete=' + domContentLoaded
      + '&startTime=' + navigationStartTime
      + '&page=' + pageName;
    return this.get(serviceUrl);
  }


  getNDLink(sid, pageInstance, ndSessionID, startTime, endTime, testRun, type, url) {
    // for session
    console.log(' getNDLink   startTime ==' + startTime + 'endTime==' + endTime);
    // startTime = (parseInt(startTime) + 300).toString();
    // endTime = endTime - 1800;
    console.log(' getNDLink   startTime ==' + startTime + 'endTime==' + endTime);
    const serviceURL = this.getRequestUrl(NvhttpService.apiUrls.ndLink) + '&testRun=' + testRun + '&startTime=' + startTime + '&endTime=' + endTime + '&ndSessionId=' + ndSessionID + '&nvSessionId=' + sid + '&requestType=' + type + '&pageinstance=' + pageInstance + '&url=' + url;

    // window.open(this.get(serviceURL,"");//response: Response) => response));
    // this.router.navigateByUrl(this.get(serviceURL,"");//response: Response) => response))
    window.open(serviceURL);
    // for page
    // for ajax
  }

  getContent(url) {
    // return this.get(AppComponent.config.proxyServer + NvhttpService.apiUrls.getFile + "&url=" + url, { responseType: 'text' },"");//response: any) => response.trim());
  }
  // Not sending the pageid,
  // case : pages having same pageinstance and diffrent page id, causing issue in getting event data
  getEventInformation(duration, sid, currentPageId, pageInstance, eventid) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.events);
    serviceUrl += `&duration=` + duration + `&currentSessionId=` + sid + `&pageInstance=` + pageInstance
      + `&pageId=-1` + `&eventList=` + eventid;
    return this.get(serviceUrl);
  }

  getDomainPData(filter: any) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.domainAggData);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    // let surl='http://10.10.60.4:8006/netvision/reports/domaindata';
    return this.get(surl);
  }

  getDomainTrendData(filter: any): Observable<Store.State> {
    let url = this.getRequestUrl(NvhttpService.apiUrls.domainTrend);
    url += '&filterCriteria=' + JSON.stringify(filter);
    // let surl='//10.10.60.4:8006/netvision/reports/trend';
    return this.get(url);
  }

  getPagePerformanceData(filter: any) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.pageperformance);
    serviceUrl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(serviceUrl);
  }

  getPageTrendChartData(filter: any) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.pageperformancetrend);
    serviceUrl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(serviceUrl);
  }

  getRevenueOpporunity(filter) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.revenueOpporunity);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }

  getPageScatteredChartData() {
    let url = this.getRequestUrl('netvision/rest/webapi/pagescatteredChart?access_token=563e412ab7f5a282c15ae5de1732bfd1&strOperName=scatteredChart');
    ParsePageFilter.pageFilters.offset--;
    const filter = JSON.parse(JSON.stringify(ParsePageFilter.pageFilters));
    const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
    const dateObj = new Date(filter.timeFilter.startTime + offset);
    filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
    const dateObjj = new Date(filter.timeFilter.endTime + offsett);
    filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    url += '&filterCriteria=' + encodeURIComponent(JSON.stringify(filter));
    ParsePageFilter.pageFilters.offset++;
    return this.get(url);
  }

  getRumAnalyticsData(filter: any) {
    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.rumdata);
    serviceUrl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(serviceUrl);
  }

  getResourcePData(filter) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.aggregateResource);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }

  getResourceTData(filter) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.domainTrend);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }

  getAppConfig() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.config);
    return this.get(url);
  }

  getEventAggData(startTime, endTime, lastTime, eventname) {
    const offset = moment.tz(new Date(startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
    const dateObj = new Date(startTime + offset);
    startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    const offsett = moment.tz(new Date(endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
    const dateObjj = new Date(endTime + offsett);
    endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');

    let serviceUrl = '';
    if (lastTime !== '') {
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.eventAggData + '&lastTime=' + lastTime + '&eventname=' + eventname);
    }
    else {
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.eventAggData + '&startDateTime=' + startTime + '&endDateTime=' + endTime + '&eventname=' + eventname);
    }

    return this.get(serviceUrl);
  }

  getEventAggAttribute(startTime, endTime, lastTime, eventname, eventData) {
    const offset = moment.tz(new Date(startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
    const dateObj = new Date(startTime + offset);
    startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    const offsett = moment.tz(new Date(endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
    const dateObjj = new Date(endTime + offsett);
    endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    let serviceUrl = '';
    if (lastTime !== '') {
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.eventAggAttribute + '&lastTime=' + lastTime + '&eventname=' + eventname + '&eventData=' + eventData);
    }
    else {
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.eventAggAttribute + '&startDateTime=' + startTime + '&endDateTime=' + endTime + '&eventname=' + eventname + '&eventData=' + eventData);
    }

    return this.get(serviceUrl);
  }

  getEventTrend(startTime, endTime, lastTime, eventname, bucketSize) {
    let serviceUrl = '';
    if (lastTime !== '') {
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.eventAggData + '&lastTime=' + lastTime + '&eventname=' + eventname);
    }
    else {
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.eventAggData + '&startDateTime=' + startTime + '&endDateTime=' + endTime + '&eventname=' + eventname);
    }

    serviceUrl += '&bucketSize=' + bucketSize + '&trendFlag=true';

    return this.get(serviceUrl);
  }

  getAllDomainTData(filter: any) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.alldomainTrend);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }

  getAllResourceTData(filter: any) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.allresourceTrend);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }

  getTestScript(sid, scriptname, type) {
    console.log('sid', sid, 'scriptname', scriptname);
    let surl = this.getRequestUrl(NvhttpService.apiUrls.testScript);
    surl += '?scriptname=' + scriptname + '&scripttype=' + type + '&access_token=563e412ab7f5a282c15ae5de1732bfd1';
    if (type == 'createscript') {
      surl += '&sid=' + sid;
    }
    else {
      surl += '&scriptFilePath=' + sid;
    }

    console.log('surl', surl);
    return this.get(surl);
  }

  getRevenueTableData(filter) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.revenuetable);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }

  getRevenueGraphData(filter) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.revenuegraph);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }

  exportAggHttpdata(filter: any, filterString: any, exporttype: any) {
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    filter.pageCount = false;
    let url = this.getRequestUrl('netvision/rest/webapi/exportAggHttpData?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterCriteria=' + JSON.stringify(filter);
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    window.open(url + '&filterString=' + filterString + '&exporttype=' + exporttype + '&timezoneflag=' + timezoneflag);
  }

  exportAggJSError(filter: any, filterString: any, exporttype: any) {
    let url = this.getRequestUrl('netvision/rest/webapi/exportAggjserror?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterCriteria=' + JSON.stringify(filter);
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    window.open(url + '&filterString=' + filterString + '&exporttype=' + exporttype + '&timezoneflag=' + timezoneflag);
  }

  getOptimizedPagePerformanceGraphData(filter) {
    let surl = this.getRequestUrl(NvhttpService.apiUrls.optimizedgraph);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }
  getImprovementGraphData(filter) {
    // console.log("filter in getImprovementGraphData : ", filter);
    let surl = this.getRequestUrl(NvhttpService.apiUrls.improvedgraph);
    surl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(surl);
  }

  getSessionTrends(filter) {
    const url = this.getRequestUrl('netvision/rest/webapi/nvsessionTrend?access_token=563e412ab7f5a282c15ae5de1732bfd1') + '&strOperName=sessionTrend&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  getSessionAggregate(filter) {
    const url = this.getRequestUrl('netvision/rest/webapi/nvsessionAggregate?access_token=563e412ab7f5a282c15ae5de1732bfd1') + '&strOperName=sessionAggregate&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  authenticateSession() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.authenticate);
    return this.get(url);
  }

  getPageFilterData(filter) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.dataService);
    url += '&strOperName=pageInfo&filterCriteria=' + encodeURIComponent(JSON.stringify(filter));
    return this.get(url);

  }

  getPageFilterCount(filter) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.dataServicecount);
    url += '&strOperName=pageInfo&filterCriteria=' + encodeURIComponent(JSON.stringify(filter));
    return this.get(url);
  }

  getFlowPathAnalysisData(filter) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.viewpath);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  getNavigationPathAnalysisData(filter) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.navigationpath);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  getTransactionData(filter) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.transactionpath);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }


  loadJSONFile() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.reportData);
    const data = this.get(url, '');
    return data;
  }

  getReportBuilderData(reportData) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.templateBuilder);
    url += '&data=' + '[' + reportData + ']';
    return this.get(url);
  }

  getReportData(filter: any) {
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }

    let serviceUrl: string = this.getRequestUrl(NvhttpService.apiUrls.special);
    serviceUrl += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(serviceUrl);
  }

  exportSessions(filter: any, filterString: any) {
    filter.sessionCount = false;

    let serviceUrl = this.getRequestUrl('netvision/rest/webapi/exportsessionfilter?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    if (filterString.toLowerCase().indexOf('active') < 0) {
      serviceUrl += '&filterCriteria=' + JSON.stringify(filter) + '&opcode=' + filterString;
    }
    else {
      const args = {};
      if (filter.clientip !== null) {
        args['clientIP'] = filter.clientip;
      }
      if (filter.loginid !== null) {
        args['loginId'] = filter.loginid;
      }
      if (filter.sid !== null) {
        args['sid'] = filter.sid;
      }
      serviceUrl += '&offset=' + filter.offset + '&limit=' + filter.limit + '&channel=-1&opcode=data&filterCriteria=' + encodeURIComponent(JSON.stringify(args));

    }
    window.open(serviceUrl + '&filterString=' + filterString);
    // return this.get(serviceUrl,"");
  }

  exportSessionspdf(filter: any, filterString: any, exporttype: any) {
    filter.sessionCount = false;
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    let serviceUrl = this.getRequestUrl('netvision/rest/webapi/exportnvsessions?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    if (filterString.toLowerCase().indexOf('active') < 0) {
      serviceUrl += '&filterCriteria=' + JSON.stringify(filter) + '&opcode=' + filterString;
    }
    else {
      const args = {};
      if (filter.clientip !== null) {
        args['clientIP'] = filter.clientip;
      }
      if (filter.loginid !== null) {
        args['loginId'] = filter.loginid;
      }
      if (filter.sid !== null) {
        args['sid'] = filter.sid;
      }
      serviceUrl += '&offset=' + filter.offset + '&limit=' + filter.limit + '&channel=-1&opcode=data&filterCriteria=' + encodeURIComponent(JSON.stringify(args));

    }
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    window.open(serviceUrl + '&filterString=' + filterString + '&exporttype=' + exporttype + '&timezoneflag=' + timezoneflag);

  }


  exportPage(filter: any, filterString: any, exporttype: any) {
    let url = this.getRequestUrl('netvision/rest/webapi/exportPagefilter?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&strOperName=pageInfo&filterCriteria=' + JSON.stringify(filter) + '&exporttype=' + exporttype;
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    window.open(url + '&filterString=' + filterString + '&timezoneflag=' + timezoneflag);
  }

  getValidateAggSession(timeFilter, sid, appsessionid) {
    const filter = { timeFilter };
    let url = this.getRequestUrl(NvhttpService.apiUrls.validateaggsession);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }
  // type: column name
  getValidateDetailSession(count, type, timeFilter) {
    const filter = { count, type, timeFilter };
    let url = this.getRequestUrl(NvhttpService.apiUrls.validatedetailsession);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  addVariation(vardata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.addNewVariation);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = JSON.stringify(vardata);
    return this.post(url, data);
    // return this.post(url, data, options,"");
  }

  updateVariation(vardata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.updateVariation);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = JSON.stringify(vardata);
    return this.post(url, data);
    // return this.post(url, data, options,"");
  }

  getVariationData(channel) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showVariation) + '&channel=' + channel;
    return this.get(url);

  }
  getABTestingData(channel) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showABVariation) + '&channel=' + channel;
    return this.get(url);

  }
  getNonABTestingData(channel) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showNonABVariation) + '&channel=' + channel;
    return this.get(url);

  }
  deleteVariation(list) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteVariation);
    url = url + '&limit=' + list;
    return this.get(url);
  }
  getApplicationView(sid, startTime, endTime) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.appsessiondata);
    url += '&sid=' + sid + '&startTime=' + startTime + '&endTime=' + endTime;
    return this.get(url);
  }

  /* exportHttp(filter:any,filterString:any)
   {
     let url = "netvision/rest/webapi/exporthttpfilter?access_token=563e412ab7f5a282c15ae5de1732bfd1";
     url += "&filterCriteria=" + JSON.stringify(filter);
     window.open(url + "&filterString="+filterString);
   }*/

  exportJSError(filter: any, filterString: any, exporttype: any) {
    let url = this.getRequestUrl('netvision/rest/webapi/exportjserrorfilter?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterCriteria=' + JSON.stringify(filter);
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    window.open(url + '&filterString=' + filterString + '&exporttype=' + exporttype + '&timezoneflag=' + timezoneflag);
  }

  ViewCrash(startTime, endTime, limit, offset, filterCriteria) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.ViewCrash);
    url += '&startTime=' + startTime + '&endTime=' + endTime + '&limit=' + limit + '&offset=' + offset + '&filterCriteria=' + filterCriteria;
    //    window.open(url);
    return this.get(url);
  }

  AggregateCrash(startTime, endTime, filterCriteria) {

    let url = this.getRequestUrl(NvhttpService.apiUrls.AggregateCrash);
    url += '&startTime=' + startTime + '&endTime=' + endTime + '&filterCriteria=' + filterCriteria;
    // return this.get(url,"");//response: Response) =>response);
    return this.get(url);
  }

  getApplicationName(appversionId) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.appname);
    url += '&appVersionId=' + appversionId;
    //return this.get(url);
    return this.http.get(this.base + url, { responseType: 'text' }).pipe(map((response: any) => response));
  }

  addgoal(filter) {

    const filters = '&name=' + filter.name + '&type=' + filter.Type + '&mode=' + filter.mode + '&value1=' + filter.value1 + '&value2=' + encodeURIComponent(filter.value2) + '&varid=' + filter.varid + '&page=' + filter.pagelist;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addgoal) + filters;
    return this.get(url);
  }

  deletegaols(filter) {
    console.log('filter', filter);
    const filters = '&varid=' + filter.varid + '&ids=' + filter.goalid;
    const url = this.getRequestUrl(NvhttpService.apiUrls.deletegoals) + filters;
    return this.get(url);
  }

  showgoals(filter): Observable<any> {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showgoals) + '&varid=' + filter;
    return this.get(url);
  }

  updategoal(filter) {

    const filters = '&name=' + filter.name + '&type=' + filter.Type + '&mode=' + filter.mode + '&value1=' + filter.value1 + '&value2=' + encodeURIComponent(filter.value2) + '&varid=' + filter.varid + '&page=' + filter.pagelist;
    const url = this.getRequestUrl(NvhttpService.apiUrls.updategoal) + filters;
    return this.get(url);
  }

  exportSessionDetail(sid, last, startTime, endTime) {
    if (startTime != '' && endTime != '') {
      const offset = moment.tz(new Date(startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(startTime + offset);
      startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(endTime + offsett);
      endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    let url = this.getRequestUrl('netvision/rest/webapi/exportsession?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    url += '&sid=' + sid + '&last=' + last + '&startTime=' + startTime + '&endTime=' + endTime + '&timezoneflag=' + timezoneflag;
    window.open(url);
  }

  storeAdminData(opcode, data) {
    let url = this.getRequestUrl('netvision/rest/webapi/storeControl?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterString=' + encodeURIComponent(JSON.stringify(data)) + '&opcode=' + opcode;
    return this.get(url);
  }

  exportReport(filter) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.exportReport);
    url += `&filterCriteria=` + encodeURIComponent(JSON.stringify(filter));
    window.open(url);
  }

  getdeviceperformance(sid, startTime, endTime) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.devicePerformance);
    url += '&sid=' + sid + '&startTime=' + startTime + '&endTime=' + endTime;
    return this.get(url);
  }

  getBusinessProcess(filter: any) {
    let url = '';
    // to test new BP URL which uses TSDB
    if (localStorage.getItem('NEW_BP_API') != 'false') {
      url = this.getRequestUrl('netvision/rest/webapi/bpdatafromtsdb?access_token=563e412ab7f5a282c15ae5de1732bfd1');
      url += `&channel=${filter.channel}&usersegmentid=${filter.usersegment}&bpname=${filter.bpname}`;
      console.log('getBusinessProcess filter - ', filter);
      if (filter.timeFilter.last && filter.timeFilter.last.trim() != '') {
        const timeFilter = Util.convertLastToFormattedInSelectedTimeZone(filter.timeFilter.last);
        url += `&startTime=${timeFilter.startTime}&endTime=${timeFilter.endTime}`;
      } else {
        url += `&startTime=${filter.timeFilter.startTime}&endTime=${filter.timeFilter.endTime}`;
      }

    } else {
      url = this.getRequestUrl('netvision/rest/webapi/businessprocess?access_token=563e412ab7f5a282c15ae5de1732bfd1');
      url += '&filterCriteria=' + JSON.stringify(filter);
    }
    return this.get(url);
  }

  getBusinessProcessOrderTotal(filter) {
    let url = this.getRequestUrl('netvision/rest/webapi/businessprocess?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterCriteria=' + JSON.stringify(filter);

    return this.get(url);
  }

  getGeneralReport() {
    const sesLoginName = this.sessionService.session.cctx.u;
    let url = this.getRequestUrl('netvision/rest/webapi/generalreports?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&sesLoginName=' + sesLoginName;
    return this.get(url);
  }

  deleteReport(deleteList, userName) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteReports);
    url += 'requestString=deleteReport&reportName=' + deleteList + '&username=' + userName;
    return this.post(url, '', {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      responseType: 'text'
    });
  }

  getSelectedCRQData(filter: any, formData: any) {

    let url: string = this.getRequestUrl(NvhttpService.apiUrls.selectedCRQ);
    url += 'DateColumnFlag=' + filter.DateColumnFlag + '&BucketMode=' + filter.BucketMode;
    if (filter.channelid !== null) {
      url += '&channelid=' + filter.channelid;
    }
    url += '&st=' + filter.st + '&et=' + filter.et;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const options = {
      headers,
    };
    const data = 'jsonString=' + JSON.stringify(formData);
    return this.post(url, data, options);
  }

  getSelectedCRQFilters() {
    const url: string = this.getRequestUrl(NvhttpService.apiUrls.selectedCRQFilters);
    return this.get(url);
    // return this.get(url, { responseType: 'text' }).pipe(retry(1));
  }


  getcustommetrics(filter: any) {
    if (filter.timeFilter.startTime != '' && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }

    let url = this.getRequestUrl(NvhttpService.apiUrls.cm);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  addevent(filter) {
    const filters = '&name=' + filter.name + '&description=' + filter.description + '&strugglingflag=' + filter.StrugglingEvent + '&icon=' + filter.Icons + '&goal=' + filter.goal;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addevent) + filters;
    return this.get(url);
  }

  getEventData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showEvents);
    return this.get(url);
  }

  deleteEvent(id) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteEvent);
    url = url + '&ids=' + id;
    return this.get(url);
    // return this.get(url, { responseType: 'text' },"");//response: any) => response);
  }

  updateEvent(filter) {
    const filters = '&name=' + filter.name + '&description=' + filter.description + '&strugglingflag=' + filter.StrugglingEvent + '&icon=' + filter.Icons + '&goal=' + filter.goal + '&ids=' + filter.id;
    const url = this.getRequestUrl(NvhttpService.apiUrls.updateEvent) + filters;
    return this.get(url); // response: any) => response);
  }

  addpage(filter) {
    const filters = '&name=' + filter.pagename + '&pagenamemethod=' + filter.pagenamemethod + '&pattern=' + encodeURIComponent(filter.pattern) + '&variablename=' + filter.variablename + '&completeurlflag=' + filter.completeurlflag;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addpage) + filters;
    return this.get(url);
  }

  getPageData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showPage);
    return this.get(url);
  }

  deletePage(pageid) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deletePage);
    url = url + '&ids=' + pageid;
    return this.get(url); // { responseType: 'text' },"");//response: any) => response);
  }

  updatePage(filter) {
    const filters = '&name=' + filter.pagename + '&pagenamemethod=' + filter.pagenamemethod + '&pattern=' + filter.pattern + '&variablename=' + filter.variablename + '&ids=' + filter.pageid + '&completeurlflag=' + filter.completeurlflag;
    const url = this.getRequestUrl(NvhttpService.apiUrls.updatePage) + filters;
    return this.get(url); // response: any) => response);
  }

  addcustom(filter) {
    const filters = '&name=' + filter.name + '&description=' + filter.description + '&type=' + filter.Type + '&encryptflag=' + filter.encryptflag + '&trendlist=' + filter.trend_list + '&channel=' + filter.channel;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addcustom) + filters;
    return this.get(url);
  }

  getCustomData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showcustom);
    return this.get(url);
  }

  deleteCustom(id) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteCustom);
    url = url + '&ids=' + id;
    return this.get(url); // { responseType: 'text' },"");//response: any) => response);
  }

  updateCustom(filter) {
    const filters = '&name=' + filter.name + '&description=' + filter.description + '&type=' + filter.Type + '&encryptflag=' + filter.encryptflag + '&ids=' + filter.id + '&trendlist=' + filter.trend_list + '&channel=' + filter.channel;
    const url = this.getRequestUrl(NvhttpService.apiUrls.updateCustom) + filters;
    return this.get(url);
  }

  addusersegment(filter) {
    const filters = '&name=' + filter.name + '&description=' + filter.description + '&icon=' + filter.icons;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addusersegment) + filters;
    return this.get(url);
  }

  addrulesusersegment(filter) {
    const filters = '&type=' + filter.type + '&arg1=' + encodeURIComponent(filter.arg1) + '&arg2=' + filter.arg2 + '&page=' + filter.pageidlist;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addrulesusersegment) + filters;
    return this.get(url);
  }

  getUserSegmentData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showUserSegment);
    return this.get(url);
  }

  getUserSegmentRuleData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showUserSegmentRule);
    return this.get(url);
  }

  deleteUserSegment(id) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteUserSegment);
    url = url + '&ids=' + id;
    return this.get(url);
  }

  updateUserSegment(filter) {
    const filters = '&name=' + filter.name + '&description=' + filter.description + '&icon=' + filter.icons + '&ids=' + filter.usersegmentid;
    const url = this.getRequestUrl(NvhttpService.apiUrls.updateUserSegment) + filters;
    return this.get(url);
  }

  addanotherrulesusersegment(filter) {
    const filters = '&type=' + filter.type + '&arg1=' + encodeURIComponent(filter.arg1) + '&arg2=' + filter.arg2 + '&page=' + filter.pageidlist + '&ids=' + filter.usersegmentid;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addanotherrulesusersegment) + filters;
    return this.get(url);
  }

  deleteruleUserSegment(id) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteruleUserSegment);
    url = url + '&ids=' + id;
    return this.get(url);
    // return this.get(url, { responseType: 'text' },"");//response: any) => response);
  }

  addupdaterulesusersegment(filter) {
    const filters = '&type=' + filter.type + '&arg1=' + encodeURIComponent(filter.arg1) + '&arg2=' + filter.arg2 + '&page=' + filter.pageidlist + '&ids=' + filter.usersegmentid;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addupdaterulesusersegment) + filters;
    return this.get(url);
  }

  addcheckpoint(filter) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.addcheckpoint);
    const body = JSON.stringify(filter);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    return this.post(url, body);
    // return this.post(url, body,options,"");
  }
  getCheckpointData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showcheckpoint);
    return this.get(url);
  }

  deleteCheckPoint(id) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteCheckPoint);
    url = url + '&ids=' + id;
    return this.get(url);
  }

  updateCheckPoint(filter) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.updateCheckPoint);
    const body = JSON.stringify(filter);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    return this.post(url, body);
    // return this.post(url,body,options,"");
  }
  addchannel(filter) {
    const filters = '&entityname=' + filter.entityname + '&entitytype=' + filter.entitytype + '&icon=' + filter.icons + '&subversion=' + encodeURIComponent(filter.subversion) + '&subversiondisplayname=' + filter.subversiondisplayname;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addchannel) + filters;
    return this.get(url);
  }

  getChanneltData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showchannel);
    return this.get(url);
  }

  deleteChannel(id) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteChannel);
    url = url + '&ids=' + id;
    return this.get(url);
    // return this.get(url, { responseType: 'text' },"");//response: any) => response);
  }

  updateChannel(filter) {
    const filters = '&entityname=' + filter.entityname + '&entitytype=' + filter.entitytype + '&icon=' + filter.icons + '&subversion=' + encodeURIComponent(filter.subversion) + '&subversiondisplayname=' + filter.subversiondisplayname + '&ids=' + filter.updateid;
    const url = this.getRequestUrl(NvhttpService.apiUrls.updateChannel) + filters;
    return this.get(url);
  }

  addBusinessProcess(filter: any) {
    const filters = '&bpname=' + filter.bpname + '&description=' + filter.description + '&channel=' + filter.channel + '&usersegmentid=' + filter.usersegmentid + '&activech=' + filter.activech + '&checkoutfunnelflag=' + filter.checkoutfunnelflag;
    const url = this.base + this.getRequestUrl(NvhttpService.apiUrls.addBusinessProcess) + filters;
    return this.http.get(url);
  }

  getBusinessProcessData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showBusinessData);
    return this.get(url);
  }

  deleteBPData(bpid) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteBPData);
    url = url + '&ids=' + bpid;
    return this.get(url);
  }

  UpdateBusinessProcess(filter: any) {
    const filters = '&bpname=' + filter.bpname + '&description=' + filter.description + '&channel=' + filter.channel + '&usersegmentid=' + filter.usersegmentid + '&activech=' + filter.activech + '&checkoutfunnelflag=' + filter.checkoutfunnelflag + '&ids=' + filter.bpid;
    const url = this.getRequestUrl(NvhttpService.apiUrls.UpdateBusinessProcess) + filters;
    return this.get(url);
  }

  SaveFlowChart(filter: any) {
    const filters = '&ids=' + filter.bpid + '&bppositionlist=' + filter.bppositionlist + '&bppagelist=' + filter.bppagelist;
    const url = this.getRequestUrl(NvhttpService.apiUrls.SaveFlowChart) + filters;
    return this.get(url);
  }

  getAuditLog(logLevel: any, action: any, description: any, module: any) {
    const username = sessionStorage.getItem('sesLoginName');
    const ip = sessionStorage.getItem('productKey');

    const filter = { logLevel, action, description, module, userName: username, ip };
    let url = this.getRequestUrl('netvision/rest/webapi/getauditlogger?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  ViewCrashTab(startTime, endTime, sid) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.crashtabinfo);
    url += '&sid=' + sid + '&startTime=' + startTime + '&endTime=' + endTime;
    return this.get(url);
  }

  getCustomReport() {
    const sesLoginName = sessionStorage.getItem('sesLoginName');
    let url = this.getRequestUrl('netvision/rest/webapi/customreports?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&sesLoginName=' + sesLoginName;
    return this.get(url);
  }

  saveCustomReport(CRQ, sesLoginName) {
    let url: string = this.getRequestUrl(NvhttpService.apiUrls.saveCustomReport);
    url += '&username=' + sesLoginName;
    return this.post(url, 'crq=' + JSON.stringify(CRQ, undefined, 4));
    // return this.post(url, 'crq=' + JSON.stringify(CRQ, undefined, 4), { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), responseType: 'text' },"");//response: any) => response);
  }

  getFeedbackData(filterCriteria) {
    if (filterCriteria.timeFilter.startTime != "" && filterCriteria.timeFilter.endTime != "") {
      let offset = moment.tz(new Date(filterCriteria.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format("Z");
      offset = offset.replace(":", "");
      let dateObj = new Date(filterCriteria.timeFilter.startTime + " " + offset);
      filterCriteria.timeFilter.startTime = moment.tz(dateObj, "UTC").format("MM/DD/YYYY HH:mm:ss");
      let offsett = moment.tz(new Date(filterCriteria.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format("Z");
      offsett = offsett.replace(":", "");
      let dateObjj = new Date(filterCriteria.timeFilter.endTime + " " + offsett);
      filterCriteria.timeFilter.endTime = moment.tz(dateObjj, "UTC").format("MM/DD/YYYY HH:mm:ss");
    }
    let url: string = this.getRequestUrl(NvhttpService.apiUrls.feedbackFilter);
    url += '&filterCriteria=' + JSON.stringify(filterCriteria);
    console.log('nvhttpservice Url: ', url);
    console.log('Response service :', filterCriteria);
    return this.get(url);
  }

  getPageDump(item, index) {
    let url: string = this.getRequestUrl(NvhttpService.apiUrls.feedbackPageDump);
    url += '&strOperName=getFeedbackSnapShotPath' + '&startTime=' + item.sessionStartTimeMilli + '&nvSessionId=' + item.sid + '&pageinstance=' + item.pageInstance + '&index=' + index + '&isFromFeedback=true';

    // return this.post(url, '', { headers: new HttpHeaders({ 'Content-Type': 'text/html' }), responseType: 'text' },"");//response: string) => response);
    //return this.get(url);
    return this.http.get(this.base + url, { responseType: 'text' }).pipe(map((response: string) => response));
  }

  exportRumanalysisPageOverview(filter: any) {
    let url = this.getRequestUrl('netvision/rest/webapi/exportrumanalytics?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    const timezoneflag = sessionStorage.getItem('_nvtimezone');
    url += `&filterCriteria=` + JSON.stringify(filter) + '&timezoneflag=' + timezoneflag;
    let rumAnalytics = document.querySelector('#pagePerformance')['title'];
    if (rumAnalytics == null) {
      rumAnalytics = '';
    }
    url += `&description=` + JSON.stringify(rumAnalytics);
    window.open(url);
  }

  getMarketGraphData(filter: any) {
    if (filter.timeFilter.startTime != null && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    let url = this.getRequestUrl(NvhttpService.apiUrls.showMarketGraph);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  getCampaignData(filter: any) {
    if (filter.timeFilter.startTime != null && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    let url = this.getRequestUrl(NvhttpService.apiUrls.campaignData);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  getCampaignGraph(filter: any) {
    if (filter.timeFilter.startTime != null && filter.timeFilter.endTime != '') {
      const offset = moment.tz(new Date(filter.timeFilter.startTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObj = new Date(filter.timeFilter.startTime + offset);
      filter.timeFilter.startTime = moment.tz(dateObj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
      const offsett = moment.tz(new Date(filter.timeFilter.endTime), sessionStorage.getItem('_nvtimezone')).format('Z');
      const dateObjj = new Date(filter.timeFilter.endTime + offsett);
      filter.timeFilter.endTime = moment.tz(dateObjj, 'UTC').format('MM/DD/YYYY HH:mm:ss');
    }
    let url = this.getRequestUrl(NvhttpService.apiUrls.campaignGraph);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  AddNewProfile(agentdata, filter) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.AddNewProfile);
    url += '&name=' + encodeURIComponent(filter.name) + '&description=' + encodeURIComponent(filter.description) + '&type=' + filter.type + '&channel=' + filter.channelid;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = JSON.stringify(agentdata);
    return this.post(url, data); // , options,"");
  }

  getAgentProfile(path, name, type) {
    console.log('ddd', name);
    let url = this.getRequestUrl(NvhttpService.apiUrls.getconfig);
    url += '&path=' + path + '&name=' + name + '&type=' + type;
    return this.get(url);
  }

  getProfileRevisions(name, path) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.showFileList);
    url += '&name=' + name + '&path=' + path;
    return this.get(url);
  }

  getAgentDBData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showAgentDBData);
    return this.get(url);
  }

  deleteCardData(name) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deleteCardData);
    url = url + '&name=' + name;
    return this.get(url);
  }

  UpdateAgentProfile(profiledata, profilename) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.UpdateAgentProfile);
    url += '&name=' + profilename;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = JSON.stringify(profiledata);
    return this.post(url, data); // , options,"");
  }

  // this will be called from replay to update sensitive elements and add Domwatcher2 filter element
  // adding a merge flag
  UpdateAgentProfileFromReplay(profiledata, profilename) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.UpdateAgentProfileReplay);
    url += '&name=' + profilename + '&mode=' + true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = JSON.stringify(profiledata);
    return this.post(url, data); // , options,"");
  }

  UpdateAgentMetadata(profiledata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.UpdateAgentMetadata);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = profiledata;
    return this.post(url, data); // , options,"");
  }


  HpdRestart(name) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.hpdrestart);
    url += '&name=' + name;
    return this.get(url);
  }

  readSnapshotFile(path) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.replaypagedata);
    url += '&replayFilepath=' + path;
    //return this.get(url);
    return this.http.get(this.base + url).pipe(map((response: Response) => response));
  }

  readAndroidSnapshotFile(path) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.androidpagedata);
    url += '&replayFilepath=' + path;
    //return this.get(url);
    return this.http.get(this.base + url, { responseType: 'blob' }).pipe(map((response: any) => response));
  }

  getReplayDBData(currentSessionId, pageinstance, sessionStartTime, sessionEndTime) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.datareq);
    url += "&nvSessionId=" + currentSessionId +
      "&strOperationName=" + "replaysession" +
      "&pageinstance=" + pageinstance +
      "&startTime=" + sessionStartTime +
      "&endTime=" + sessionEndTime;
    //return this.get(url,"");
    return this.http.get(this.base + url, { responseType: 'text' }).pipe(map((response: any) => response));
  }

  getReplayJsonData(requestedPage, currentSessionId, basepath, version) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.replayjsondata);
    url += '&requestPage=' + requestedPage +
      '&sid=' + currentSessionId +
      '&basePath=' + basepath +
      '&currentVersion=' + version;
    return this.get(url);
  }

  getMethodTraceData(sid: any, partitionID: any, pageInstance: any, uuid: any) {
    const filter = {};
    filter['sid'] = sid;
    filter['partitionID'] = partitionID;
    filter['pageInstance'] = pageInstance;
    filter['uuid'] = uuid;
    let url = this.getRequestUrl(NvhttpService.apiUrls.methodtrace);
    url += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(url);
  }

  getMethodTraceTransactionData(sid: any, partitionID: any, pageInstance: any, uuid: any, txnstarttime: any, txnendtime: any) {
    const filter = {};
    filter['sid'] = sid;
    filter['partitionID'] = partitionID;
    filter['pageInstance'] = pageInstance;
    filter['uuid'] = uuid;
    filter['flag'] = 'true';
    filter['txnstarttime'] = txnstarttime;
    filter['txnendtime'] = txnendtime;
    let url = this.getRequestUrl(NvhttpService.apiUrls.methodtrace);
    url += `&filterCriteria=` + JSON.stringify(filter);
    return this.get(url);
  }

  UpdateRumData(rumdata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.UpdateRumData);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = JSON.stringify(rumdata);
    return this.post(url, data); // , options,"");
  }

  getRumData(slaveid) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.showRumData);
    url += '&slaveid=' + slaveid;
    return this.get(url);
  }

  RumHpdRestart() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.rumhpdactivate);
    return this.get(url);
  }

  getpendingRumData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showpendingRumData);
    return this.get(url);
    // return this.get(url, { responseType: 'text' },"");//response: any) => response);

  }

  Updatependingkeywords(pendingrumdata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.UpdatePendingKeywords);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = JSON.stringify(pendingrumdata);
    return this.post(url, data); // , options,"");
  }

  getCallbacks() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.callbacks);
    return this.get(url);
  }

  addCallbacks(filter) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.addcallback);
    const data = JSON.stringify(filter);

    return this.post(url, data); // ,"");
  }

  updateCallback(callback) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.updatecallback);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };

    const data = JSON.stringify(callback);

    return this.post(url, data); // , options,"");
  }

  deleteCallback(callbackId) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.deletecallback);
    url += '&callbackId=' + callbackId;

    return this.get(url);
  }

  getCallbackVersionList(callbackId: number) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.callbackVersions);
    url += '&callbackId=' + callbackId;
    return this.get(url);
  }

  updateCallbackVersion(versionId: number) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.updateCallbackVersion);
    url += '&versionId=' + versionId;
    return this.get(url);
  }

  updateCallbackVersionName(versionId: number, versionName: string) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.updateCallbackVersionName);
    url += '&versionId=' + versionId + '&versionName=' + versionName;
    return this.get(url);
  }

  checkForExtension(url) {
    return this.get(url);
  }

  getAttentionMapData(st, et, pagename, devicename, channelid, usersegmentid) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.attentionMap);
    url += '&startTime=' + st +
      '&endTime=' + et +
      '&currentPage=' + pagename +
      '&type=' + devicename +
      '&channel=' + channelid +
      '&usersegmentid=' + usersegmentid;
    return this.get(url);
  }

  getHeatMapData(st, et, pagename, devicename, channelid, usersegmentid, reqlimit) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.heatMap);
    url += '&startTime=' + st +
      '&endTime=' + et +
      '&currentPage=' + pagename +
      '&devicetype=' + devicename +
      '&channel=' + channelid +
      '&usersegmentid=' + usersegmentid +
      '&reqlimit=' + reqlimit;
    return this.get(url);
  }

  // Task scheduler
  getTaskReport() {
    let url = this.getRequestUrl('netvision/rest/webapi/nvtaskscheduler?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&product=' + sessionStorage.getItem('strServerType');
    return this.get(url);
  }

  getTaskOperation(filter: string, operation) {
    let url = this.getRequestUrl('netvision/rest/webapi/taskSchedulerOperation?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&strOperName=' + operation;
    return this.post(url, 'data=' + filter); // , { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), responseType: 'text' },"");//response: string) => response);
  }

  getReportList() {
    const url = this.getRequestUrl('netvision/rest/webapi/reportsList?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    return this.get(url);
  }

  getDeleteReport(name) {
    let url = this.getRequestUrl('netvision/rest/webapi/deleteReport?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&name=' + name;
    return this.get(url);
  }

  getschedulerReport(reportType) {
    const sesLoginName = sessionStorage.getItem('sesLoginName');
    let url = this.getRequestUrl('netvision/rest/webapi/schedulerReport?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    // url+= "&name=" +name;
    url += reportType + '&sesLoginName=' + sesLoginName;
    return this.get(url);
  }

  getaddTask(json: any) {
    const url = this.getRequestUrl('netvision/rest/webapi/addSchedulerTask?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    return this.post(url, 'data=' + json); // , { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), responseType: 'text' },"");//response: any) => response);
  }

  getTaskMailinfo(subject: any, to: string, body: any, attch: any) {
    const filter = {} as { subject: string, to: string, body: string, attach: any };
    filter.subject = subject;
    filter.to = to;
    filter.body = body;
    filter.attach = attch;

    let url = this.getRequestUrl('netvision/rest/webapi/schedulerMail?access_token=563e412ab7f5a282c15ae5de1732bfd1');
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }

  getFileData(path, name) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.getfiledata);
    url += '&path=' + path + '&name=' + name;
    return this.get(url);
    // return this.get(url, { responseType: 'text' },"");//response: string) => response);
  }

  SaveBackupCleanupData(filedata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.saveBackCleanData);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = JSON.stringify(filedata);
    return this.post(url, data); // , options,"");
  }

  getAnalatyicalForms(st, et, channel, pagename) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.analyticalforms);
    url += '&startDateTime=' + st +
      '&endDateTime=' + et +
      '&channel=' + channel +
      '&page=' + pagename;
    console.log('url in rest=', url);
    return this.get(url);
    // return this.get(url, { responseType: 'text' },"");//response: string) => response);
  }

  exportProfileMethod(filter_methodname: any) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.exportProfiler);
    url += '&filterCriteria=' + JSON.stringify(filter_methodname);
    window.open(url);
  }
  saveNavigationImageTOServer(img, pagename) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.saveNavigationImageTOServer);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const options = {
      headers
    };
    const data = img + '&pageName=' + pagename;
    return this.post(url, data); // , options,"");
  }

  ViewCrashTabexport(startTime, endTime, sid, filterCriteria) {

    let url = this.getRequestUrl(NvhttpService.apiUrls.crashTabViewExport);
    url += '&sid=' + sid + '&startTime=' + startTime + '&endTime=' + endTime + '&filterCriteria=' + filterCriteria;
    window.open(url);
  }

  getHttpScatteredChartData(filter) {

    let url = this.getRequestUrl(NvhttpService.apiUrls.httpScatteredChart);
    url += '&filterCriteria=' + JSON.stringify(filter);
    return this.get(url);
  }


  getRumDataformultidisk(slaveid) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.showMultiDiskData);
    url += '&slaveid=' + slaveid;
    return this.get(url); // response: Response[]) => response);
  }

  getDiskData(slaveid) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.showDiskData);
    url += '&slaveid=' + slaveid;
    return this.get(url);
  }

  SaveDiskAllocation(diskallocatedata, slaveid) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.SaveDiskAllocationData);
    url += '&slaveid=' + slaveid;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (diskallocatedata);
    return this.post(url, data); // , options,"");

  }

  GetSlaveNodeList() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.getSlaveList);
    return this.get(url);
  }

  getAppNameandVersion() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.appNameandVersion);
    return this.get(url);
  }

  getFormAnalyticsData(st, et, last, channel, pagename, remoteAddress) {

    let url = this.getRequestUrl(NvhttpService.apiUrls.formAnalayticsReport);
    url += '&startTime=' + st +
      '&endTime=' + et +
      '&last=' + last +
      '&channel=' + channel +
      '&page=' + pagename +
      '&strOperName=overallform' +
      '&remoteAddress=' + remoteAddress;
    console.log('url in rest=', url);
    return this.get(url);
  }

  getFormAnalyticsFormData(st, et, last, channel, pagename, remoteAddress, formname) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.formAnalayticsReport);
    url += '&startTime=' + st +
      '&endTime=' + et +
      '&last=' + last +
      '&channel=' + channel +
      '&page=' + pagename +
      '&formName=' + formname +
      '&strOperName=formAnalytics' +
      '&remoteAddress=' + remoteAddress;
    console.log('url in rest=', url);
    return this.get(url);
  }

  getFormAnalyticsPageNameMap() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.formAnalyticsPageName);
    return this.get(url);
  }

  getFormAnalyticsFormNameMap() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.formAnalyticsFormName);
    return this.get(url);
  }

  getToken(productKey: string, userName: string, validityPeriod: string) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.generateToken);
    url += '?productKey=' + productKey + '&userName=' + userName + '&validityPeriod=' + validityPeriod;
    return this.get(url);
  }

  loginToProductUI(productKey: string, userName: string, data: any) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.authenticateUser);
    url += '?productKey=' + productKey + '&userName=' + userName + 'isRequestFrmLogin=true';
    return this.post(url, data);
  }

  getProductUIDetails() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.getProductUIDetails);
    return this.get(url);
  }

  getParsers() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.parsers);
    return this.get(url);
  }

  postParserData(data) {
    const filters = '&enable=' + data.enable + '&cronexpression=' + encodeURIComponent(data.cronExpression) + '&progressinterval=' + data.progressinterval + '&processolddata=' + data.processolddata + '&mladayenable=' + data.mladayenable + '&mladayprogressinterval=' + data.mladayprogressinterval + '&mlamonthenable=' + data.mlamonthenable + '&mlamonthprogressinterval=' + data.mlamonthprogressinterval + '&mlaweekenable=' + data.mlaweekenable + '&mlaweekprogressinterval=' + unescape(data.mlaweekprogressinterval) + '&aprof_file=' + data.aprofFile;
    const url = this.getRequestUrl(NvhttpService.apiUrls.addparser) + filters;
    return this.get(url);
  }

  UpdateParerTablespace(parserdata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.UpdateParserTableAllocation);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (parserdata);
    return this.post(url, data); // , options,"");

  }

  writeColumnstoFile(selectCols) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.writeColumns);
    url += '&filterCriteria=' + JSON.stringify(selectCols);
    return this.get(url); // response: Response[]) => response);
  }

  updateCrashTab(startTime, endTime, sid, data) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.updatecrashtabinfo);
    url += '&sid=' + sid + '&startTime=' + startTime + '&endTime=' + endTime;
    return this.post(url, data); // ,"");
  }

  getTeplateReportList() {
    const url: string = this.getRequestUrl(NvhttpService.apiUrls.templateReportList);
    return this.get(url); // response: Response[]) => response);
  }

  getTemplateReportDetail(report) {
    let url: string = this.getRequestUrl(NvhttpService.apiUrls.templateReportDetails);
    url += '&reportName=' + report;
    return this.get(url);
  }

  getEventImpactInfo(last: string, st: string, et: string, c: string, e: string): Observable<any> {
    let serviceUrl = '';
    if (localStorage.getItem("NEW_EI_API") == 'false')
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.eventImpactInfo);
    else 
      serviceUrl = this.getRequestUrl(NvhttpService.apiUrls.eventImpactInfoTSDB);
      
    serviceUrl += '&last=' + last + '&startTime=' + st + '&endTime=' + et + '&channel=' + c + '&eventname=' + e;
    return this.get(serviceUrl);
  }

  getPageBaselineData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showpagebaselinedata);
    return this.get(url);
  }

  PostBaselinedata(baselinepostdata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.postbaselinedata);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (baselinepostdata);
    return this.put(url, data); // , options,"");

  }
  getDomainBaselineData() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.showdomainbaselinedata);
    return this.get(url);
  }

  GenerateBaselineData(postdata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.generatebaslinedata);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (postdata);
    return this.post(url, data); // , options,"");
  }


  PostDomainBaselinedata(domainbaselinepostdata) {
    const url = this.getRequestUrl(NvhttpService.apiUrls.postdomainbaselinedata);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const options = {
      headers
    };
    const data = (domainbaselinepostdata);
    return this.put(url, data); // , options,"");

  }

  CheckStatusBaseline() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.checkstatusbaseline);
    return this.get(url);
  }

  getLPTable() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.lptabledata);
    return this.get(url);
  }

  startParser(startTime, endTime, debug_file) {
    let url: string = this.getRequestUrl(NvhttpService.apiUrls.startParser);
    url += '&startTime=' + startTime + '&endTime=' + endTime + '&debug_file=' + debug_file + '&aprof_name=';
    return this.get(url); // response: Response) => response );
  }

  fillMapParserInfoToFile(data) {
    let url = this.getRequestUrl(NvhttpService.apiUrls.mapParserInfo);
    url += '&filterCriteria=' + data;
    return this.get(url);
  }

  getMapParserInfoToFile() {
    const url = this.getRequestUrl(NvhttpService.apiUrls.getMapParserInfo);
    return this.get(url); // response: any) => response);
  }

  getNVDC() {
    if (this.nvDC) { return this.nvDC; }

    if (sessionStorage.getItem('isMultiDCMode') != 'true') {
      return null;
    }

    const dcArray = []; // this._config.getDCInfoObj();
    if (!dcArray || dcArray.length == 0) {
      console.error('NV MultiDC - netvision type dc is not present');
      return null;
    }

    for (const property in dcArray) {
      if (dcArray[property].productType === 'netvision') {
        this.nvDC = dcArray[property];
        break;
      }
    }

    if (this.nvDC == null) {
      console.error('NV MultiDC - netvision type dc is not present');
    }

    return this.nvDC;
  }

  readMultipleJSONFile(clientName: string) {

    const host = environment.api.netvision.base.base;
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
    let url1: any;
    let url2: any;
    let url3: any;
    if (clientName === 'jcp') {
      url1 = this.http.get(host + 'netvision/samples/JCPenney_ClientConfig.json');
      url2 = this.http.get(host + 'netvision/samples/CustomConfig.json');
      url3 = this.http.get(host + 'netvision/samples/StandardReportConfig.json');
    } else if (clientName === 'kohls') {
      url1 = this.http.get(host + 'netvision/samples/Kohls_ClientConfig.json');
      url2 = this.http.get(host + 'netvision/samples/CustomConfig.json');
      url3 = this.http.get(host + 'netvision/samples/StandardReportConfig.json');
      console.log('urls kohls', url1, url2, url3);
    } else if (clientName === 'kohlspoc') {
      url1 = this.http.get(host + 'netvision/samples/KohlsPoc_ClientConfig.json');
      url2 = this.http.get(host + 'netvision/samples/CustomConfig.json');
      url3 = this.http.get(host + 'netvision/samples/StandardReportConfig.json');
      console.log('urls kohlsPoc', url1, url2, url3);
    } else if (clientName === '') {
      url2 = this.http.get('/netvision/samples/CustomConfig.json');
      url3 = this.http.get('/netvision/samples/StandardReportConfig.json');
      return forkJoin([url2, url3]);
    }

    return forkJoin([url1, url2, url3]);
  }

  getStoreID(id) {
    const url = `/netvision/reports/nvAjaxController.jsp?strOperName=getTerminal&storeId=` + id;
    return this.get(url);
  }
  showTerminal(storeid): Observable<any> {
    const url = this.getRequestUrl(NvhttpService.apiUrls.TerminalId) + '&storeid=' + storeid;
    return this.get(url);
  }
}
